package au.org.ala.fieldcapture

class ModelJSTagLib {

    static namespace = "md"

    private final static INDENT = "    "
    private final static operators = ['sum':'+', 'times':'*', 'divide':'/']
    private final static String QUOTE = "\"";
    private final static String SPACE = " ";
    private final static String EQUALS = "=";

    /*------------ JAVASCRIPT for dynamic content -------------*/

    def jsModelObjects = { attrs ->
        attrs.model?.dataModel?.each { model ->
            if (model.dataType == 'list') {
                repeatingModel(attrs, model, out)
                totalsModel attrs, model, out
            }
            else if (model.dataType == 'matrix') {
                matrixModel attrs, model, out
            }
        }
    }

    def jsViewModel = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                listViewModel(attrs, mod, out)
                columnTotalsModel out, attrs, mod
            }
            else if (mod.dataType == 'matrix') {
                matrixViewModel(attrs, mod, out)
            }
            else if (mod.computed) {
                computedViewModel(out, attrs, mod, 'self.data', 'self.data')
            }
            else if (mod.dataType == 'text') {
                textViewModel(mod, out)
            }
            else if (mod.dataType == 'number') {
                numberViewModel(mod, out)
            }
        }
    }

    /**
     * This js is inserted into the 'loadData()' function of the view model.
     *
     * It loads the existing values (or default values) into the model.
     */
    def jsLoadModel = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                out << INDENT*4 << "self.load${mod.name}(data.${mod.name});\n"
                loadColumnTotals out, attrs, mod
            }
            else if (mod.dataType == 'matrix') {
                //out << INDENT*4 << "self.load${mod.name.capitalize()}(data.${mod.name});\n"
            }
            else if (mod.dataType == 'text' && !mod.computed) {
                out << INDENT*4 << "self.data['${mod.name}'](orBlank(data['${mod.name}']));\n"
            }
            else if (mod.dataType == 'number' && !mod.computed) {
                out << INDENT*4 << "self.data['${mod.name}'](orZero(data['${mod.name}']));\n"
            }
        }
    }

    def columnTotalsModel(out, attrs, model) {
        if (!model.columnTotals) { return }
        out << INDENT*3 << "self.data.${model.columnTotals.name} = ko.observable({});\n"
    }

    def loadColumnTotals(out, attrs, model) {
        if (!model.columnTotals) { return }
        def name = model.columnTotals.name
        def objectName = name.capitalize() + "Row"
        model.columns.each { col ->
            if (!col.noTotal) {
                out << INDENT*4 << "self.data.${name}().${col.name} = new ${objectName}('${col.name}');\n"
            }
        }
    }

    def jsRemoveBeforeSave = { attrs ->
        if (attrs.model?.viewModel?.any({ it.dataType == 'tableWithEditableRows'})) {
            out << INDENT*4 << "delete jsData.selectedRow;\n"
        }
    }

    def computedViewModel(out, attrs, model, propertyContext, dependantContext) {
        computedViewModel(out, attrs, model, propertyContext, dependantContext, null)
    }
    def computedViewModel(out, attrs, model, propertyContext, dependantContext, parentModel) {
        //log.debug "computedViewModel = ${model}"
        out << "\n" << INDENT*3 << "${propertyContext}.${model.name} = ko.computed(function () {\n"
        if (model.computed.dependents == "all") {
            out <<
                    """                var total = 0, value;
                \$.each(viewModel.data.${parentModel.source}(), function(i, obj) {
                    value = obj[name]();
                    if (isNaN(value)) {
                        total = total + (value ? 1 : 0)
                    } else {
                        total = total + Number(value);
                    }
                });
                return total;
"""
        }
        else if (model.computed.operation == 'percent') {
            if (model.computed.dependents?.size() > 1) {
                def dividend = model.computed.dependents[0]
                def divisor = model.computed.dependents[1]
                def rounding = model.computed.rounding ?: 2
                if (divisor == "#rowCount") {
                    divisor = "${dependantContext}.${parentModel.source}().length"
                }
                out <<
                        """                percent = self.${dividend}() * 100 / ${divisor};
                return neat_number(percent, ${rounding});
"""
            }
        }
        else if (model.computed.operation == "lookup") {
            computedByNumberRangeLookupFunction out, attrs, model, "self.${model.computed.dependents[0]}"
        }
        else if (model.computed.dependents.fromList) {
            out << INDENT*4 << "var total = 0;\n"
            out << INDENT*4 << "for(var i = 0; i < ${dependantContext}.${model.computed.dependents.fromList}().length; i++) {\n"
            out << INDENT*5 << "var value = ${dependantContext}.${model.computed.dependents.fromList}()[i].${model.computed.dependents.source}();\n"
            out << INDENT*6 << "total = total ${operators[model.computed.operation]} Number(value); \n"
            out << INDENT*4 << "}\n"
            out << INDENT*4 << "return total;\n"
        }
        else if (model.computed.dependents.fromMatrix) {
            out << INDENT*4 << "var total = 0;\n"
            out << INDENT*4 << "var grid = ${dependantContext}.${model.computed.dependents.fromMatrix};\n"
            // iterate columns and get value from model.computed.dependents.row
            out << INDENT*4 << "\$.each(grid, function (i,obj) {\n"
            out << INDENT*5 << "total = total ${operators[model.computed.operation]} Number(obj.${model.computed.dependents.row}());\n"
            out << INDENT*4 << "});\n"
            out << INDENT*4 << "return total;\n"
        }
        else if (model.computed.dependents.from) {
            out << """
                var total = 0, dummyDependency = self.transients.dummy();
                \$.each(${dependantContext}.${model.computed.dependents.from}(), function (i, obj) {
                    total += obj.${model.computed.dependents.source}();
                });
                return total;
"""
        }
        out << INDENT*3 << "});\n"
    }

    def computedByNumberRangeLookupFunction(out, attrs, model, source) {
        def lookupMap = findInDataModel(attrs, model.computed.lookupMap)
        out <<
                """                var x = Number(${source}());
                if (isNaN(x)) { return '' }
"""
        lookupMap.map.each {
            if (it.inputMin == it.inputMax) {
                out << INDENT*4 << "if (x === ${it.inputMin}) { return ${it.output} }\n"
            } else {
                out << INDENT*4 << "if (x > ${it.inputMin} && x <= ${it.inputMax}) { return ${it.output} }\n"
            }
        }
    }

    def makeRowModelName(name) {
        def rowModelName = "${name}Row"
        return rowModelName[0].toUpperCase() + rowModelName.substring(1)
    }

    /**
     * Creates a js array that holds the row keys in the correct order, eg,
     * var <modelName>Rows = ['row1key','row2key']
     */
    def matrixModel(attrs, model, out) {
        out << INDENT*2 << "var ${model.name}Rows = [";
        def rows = []
        model.rows.each {
            rows << "'${it.name}'"
        }
        out << rows.join(',')
        out << "];\n"
        out << INDENT*2 << "var ${model.name}Columns = [";
        def cols = []
        model.columns.each {
            cols << "'${it.name}'"
        }
        out << cols.join(',')
        out << "];\n"
    }

    def matrixViewModel(attrs, model, out) {
        out << """
            self.data.${model.name} = [];//ko.observable([]);
            self.data.${model.name}.init = function (data, columns, rows) {
                var that = this, column;
                if (!data) data = [];
                \$.each(columns, function (i, col) {
                    column = {};
                    column.name = col;
"""
        model.rows.eachWithIndex { row, rowIdx ->
            if (!row.computed) {
                def value = "data[i] ? data[i].${row.name} : 0"
                switch (row.dataType) {
                    case 'number': value = "data[i] ? orZero(${value}) : '0'"; break
                    case 'text': value = "data[i] ? orBlank(${value}) : ''"; break
                    case 'boolean': value = "data[i] ? orFalse(${value}) : 'false'"; break
                }
                out << INDENT*5 << "column.${row.name} = ko.observable(${value});\n"
            }
        }
        // add observables to array before declaring the computed observables
        out << INDENT*5 << "that.push(column);\n"
        model.rows.eachWithIndex { row, rowIdx ->
            if (row.computed) {
                computedObservable(row, 'column', 'that[i]', out)
            }
        }

        out << """
                });
            };
            self.data.${model.name}.init(outputData.${model.name}, ${model.name}Columns, ${model.name}Rows);
            self.data.${model.name}.get = function (row,col) {
                var value = this[col][${model.name}Rows[row]];
"""
        if (attrs.edit) {
            out << INDENT*4 << "return value;\n"
        } else {
            out << INDENT*4 << "return (value() == 0) ? '' : value;\n"
        }
        out << """
            };
            self.load${model.name.capitalize()} = function (data) {
                self.data.${model.name}.init(data, ${model.name}Columns, ${model.name}Rows);
            };
"""
    }

    def repeatingModel(attrs, model, out) {
        def edit = attrs.edit as boolean
        def editableRows = viewModelFor(attrs, model.name, '')?.editableRows
        def observable = editableRows ? 'protectedObservable' : 'observable'
        out << INDENT*2 << "var ${makeRowModelName(model.name)} = function (data) {\n"
        out << INDENT*3 << "var self = this;\n"
        out << INDENT*3 << "if (!data) data = {};\n"
        model.columns.each { col ->
            if (col.computed) {
                switch (col.dataType) {
                    case 'number':
                        computedObservable(col, 'self', 'self', out)
                        break;
                }
            }
            else {
                switch (col.dataType) {
                    case 'simpleDate':
                        out << INDENT*3 << "this.${col.name} = ko.${observable}(orBlank(data['${col.name}'])).extend({simpleDate: false});\n"
                        break;
                    case 'text':
                        out << INDENT*3 << "this.${col.name} = ko.${observable}(orBlank(data['${col.name}']));\n"
                        break;
                    case 'number':
                        out << INDENT*3 << "this.${col.name} = ko.${observable}(orZero(data['${col.name}']));\n"
                        break;
                    case 'boolean':
                        out << INDENT*3 << "this.${col.name} = ko.${observable}(orFalse(data['${col.name}']));\n"
                        break;
                }
            }
        }
        if (edit && editableRows) {
            out << INDENT*3 << "this.isSelected = ko.observable(true);\n"
            out << """
            this.commit = function () {
                self.doAction('commit');
            };
            this.reset = function () {
                self.doAction('reset');
            };
            this.doAction = function (action) {
                var prop, item;
                for (prop in self) {
                    if (self.hasOwnProperty(prop)) {
                        item = self[prop];
                        if (ko.isObservable(item) && item[action]) {
                           item[action]();
                        }
                    }
                }
            };
            this.isNew = false;
            this.toJSON = function () {
                var js = ko.toJS(this);
                delete js.isSelected;
                delete js.isNew;
                return js;
            };
"""
        }
        out << INDENT*2 << "};\n"
    }

    def totalsModel(attrs, model, out) {
        if (!model.columnTotals) { return }
        out << """
        var ${model.columnTotals.name.capitalize()}Row = function (name) {
            var self = this;
"""
        model.columnTotals.rows.each { row ->
            computedViewModel(out, attrs, row, 'this', 'viewModel.data', model.columnTotals)
        }
        out << """
        };
"""
    }

    def textViewModel(model, out) {
        out << "\n" << INDENT*3 << "self.data.${model.name} = ko.observable();\n"
    }

    def numberViewModel(model, out) {
        out << "\n" << INDENT*3 << "self.data.${model.name} = ko.observable();\n"
    }

    def computedObservable(model, propertyContext, dependantContext, out) {
        out << INDENT*5 << "${propertyContext}.${model.name} = ko.computed(function () {\n"
        // must be at least one dependant
        def numbers = []
        def checkNumberness = []
        model.computed.dependents.each {
            def ref = it
            def path = dependantContext
            if (ref.startsWith('$')) {
                ref = ref[1..-1]
                path = "self.data"
            }
            numbers << "Number(${path}.${ref}())"
            checkNumberness << "isNaN(Number(${path}.${ref}()))"
        }
        out << INDENT*6 << "if (" + checkNumberness.join(' || ') + ") { return 0; }\n"
        if (model.computed.operation == 'divide') {
            // can't divide by zero
            out << INDENT*6 << "if (${numbers[-1]} === 0) { return 0; }\n"
        }
        def expression = numbers.join(" ${operators[model.computed.operation]} ")
        if (model.computed.rounding) {
            expression = "neat_number(${expression},${model.computed.rounding})"
        }
        out << INDENT*6 << "return " + expression + ";\n"
        out << INDENT*5 << "});\n"
    }

    def listViewModel(attrs, model, out) {
        def rowModelName = makeRowModelName(model.name)
        def editableRows = viewModelFor(attrs, model.name, '')?.editableRows
        def defaultRows = []
        model.defaultRows?.each{
            defaultRows << INDENT*5 + "self.data.${model.name}.push(new ${rowModelName}(${it.toString()}));"
        }
        def insertDefaultModel = defaultRows.join('\n')

        out << """
            self.data.${model.name} = ko.observableArray([]);
            self.selectedRow = ko.observable();
            self.load${model.name} = function (data) {
                if (data === undefined) {
                    ${insertDefaultModel}
                } else {
                    \$.each(data, function (i, obj) {
                        self.data.${model.name}.push(new ${rowModelName}(obj));
                    });
                }
            };
"""
        if (attrs.edit) {
            out << """
            self.addRow = function () {
                var newRow = new ${rowModelName}();
                self.data.${model.name}.push(newRow);
                ${editableRows ? "newRow.isNew = true; self.editRow(newRow);" : ""}
            };
            self.removeRow = function (row) {
                self.data.${model.name}.remove(row);
                ${editableRows ? "self.selectedRow(null);" : ""}
            };
"""
            if (editableRows) {
                out << """
            self.templateToUse = function (row) {
                return self.selectedRow() === row ? 'editTmpl' : 'viewTmpl';
            };
            self.editRow = function (row) {
                self.selectedRow(row);
                row.isSelected(true);
            };
            self.accept = function (row) {
                // todo: validation
                row.commit();
                self.selectedRow(null);
                row.isSelected(false);
                row.isNew = false;
            };
            self.cancel = function (row) {
                if (row.isNew) {
                    self.removeRow(row);
                } else {
                    row.reset();
                    self.selectedRow(null);
                    row.isSelected(false);
                }
            };
"""
            }
        }
    }

    /*------------ methods to look up attributes in the view model -------------*/
    static viewModelFor(attrs, name, context) {
        def viewModel = attrs.model.viewModel
        // todo: this needs to use context to do a hierarchy search
        def x = viewModel.find { it.name == name }
        return viewModel.find { it.source == name }
    }

    def findInDataModel(attrs, name) {
        def dataModel = attrs.model.dataModel
        // todo: just search top level for now
        dataModel.find {it.name == name}
    }

}
