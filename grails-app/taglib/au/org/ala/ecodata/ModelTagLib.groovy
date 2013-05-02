package au.org.ala.ecodata

/**
 * Generates web page content for metadata-driven dynamic data entry and display.
 */
class ModelTagLib {

    static namespace = "md"

    private final static INDENT = "    "
    private final static operators = ['sum':'+', 'times':'*', 'divide':'/']
    private final static String QUOTE = "\"";
    private final static String SPACE = " ";
    private final static String EQUALS = "=";

    /*------------ STYLES for dynamic content -------------*/
    // adds a style block for the dynamic components
    def modelStyles = { attrs ->
        attrs.model?.viewModel?.each { mod ->
            switch (mod.type) {
                case 'grid':
                case 'tableWithEditableRows':
                    tableStyle(attrs, mod, out)
            }
        }
    }

    def tableStyle(attrs, model, out ) {
        def edit = attrs.edit
        def tableClass = model.source

        out << '<style type="text/css">\n'
        model.columns.eachWithIndex { col, i ->

            def width = col.width ? "width:${col.width};" : ""
            def textAlign = getTextAlign(attrs, col, model.source)
            if (width || textAlign) {
                out << INDENT*2 << "table.${tableClass} td:nth-child(${i+1}) {${width}${textAlign}}\n"
            }
        }
        // add extra column for edit buttons
        if (edit && model.addRows) {
            out << INDENT*2 << "table.${tableClass} td:last-child {width:20%;text-align:center;}\n"
        }
        out << INDENT << "</style>"
    }

    def getTextAlign(attrs, col, context) {
        //println "col=${col}"
        //println "type=${getType(attrs, col.source, context)}"
        // check for explicit first
        if (col.textAlign) return "text-align:${col.textAlign};"
        return (getType(attrs, col.source, context) in ['boolean','number']) ? "text-align:center;" : ""
    }

    /*---------------------------------------------------*/
    /*------------ HTML for dynamic content -------------*/
    /*---------------------------------------------------*/

    /**
     * Main tag to insert html
     * @attrs model the data and view models
     * @attrs edit if true the html will support the editing of values
     */
    def modelView = { attrs ->
        attrs.model?.viewModel?.eachWithIndex { mod, index ->
            switch (mod.type) {
                case 'tableWithEditableRows':
                    attrs.ter = mod
                    ter attrs, mod, out, index
                    break
                case 'grid':
                    grid attrs, mod, out
                    break
                case 'row':
                    row(mod, out)
                    break
            }
        }
    }

    /**
     * Generates the 'data-bind' attribute based on model properties.
     * @param model of the data element
     * @param context the dot notation path to the data
     * @param editable if the html element is an input
     * @return the data binding
     */
    def dataBinding(model, context, editable) {
        if (model.type == 'literal') return ""
        def action
        if (model.type == 'boolean') {
            action = editable ? 'checkbox' : 'visible'
        } else {
            action = editable ? 'value' : 'text'
        }
        def source = (context ? context + '.' : '') + model.source
        return " data-bind=\"${action}:${source}\""
    }

    /**
     * Generates an element to display or edit a value.
     * @param model of the data element
     * @param context the dot notation path to the data
     * @param editable if the html element is an input
     * @param at any additional html attributes to output as a AttributeMap
     * @param databindAttrs additional clauses to add to the data binding
     * @return the markup
     */
    def dataTag(model, context, editable, at, databindAttrs) {
        def result = ""
        if (!databindAttrs) { databindAttrs = new DatabindingMap()}
        if (!at) { at = new AttributeMap()}
        def toEdit = editable && !model.computed && !model.noEdit
        def matrix = model.type + '-' + (toEdit ? 'edit' : 'view')
        def source = (context ? context + '.' : '') + model.source
        if (model.preLabel) {
            result = "<span class='label preLabel'>${model.preLabel}</span>"
        }
        switch (matrix) {
            case 'literal-edit':
            case 'literal-view':
                result += "<span${at.toString()}>${model.source}</span>" // don't include context in literals
                break
            case 'text-view':
            case 'number-view':
                databindAttrs.add 'text',source
                result += "<span${at.toString()} data-bind='${databindAttrs.toString()}'></span>"
                break
            case 'text-edit':
                at.addClass getInputSize(model.width)
                databindAttrs.add 'value', source
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}' type='text' class='input-small'/>"
                break
            case 'number-edit':
                at.add 'style','text-align:center'
                databindAttrs.add 'value', source
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}' type='text' class='input-mini'/>"
                break
            case 'boolean-view':
                databindAttrs.add 'visible', source
                result += "<i data-bind='${databindAttrs.toString()}' class='icon-ok'></i>"
                break
            case 'boolean-edit':
                databindAttrs.add 'checked', source
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}' type='checkbox' class='checkbox'/>"
                break
            case 'textarea-view':
                databindAttrs.add 'text', source
                result += "<span${at.toString()} data-bind='${databindAttrs.toString()}'></span>"
                break
        }
        if (model.postLabel) {
            result += "<span class='postLabel'>${model.postLabel}</span>"
        }
        return result
    }

    // convenience method for the above
    def dataTag(model, context, editable, attrs) {
        dataTag(model, context, editable, attrs, null)
    }

    // convenience method for the above
    def dataTag(model, context, editable) {
        dataTag(model, context, editable, null, null)
    }

    def getInputSize(width) {
        if (!width) { return 'input-small' }
        if (width && width[-1] == '%') {
            width = width - '%'
        }
        switch (width.toInteger()) {
            case 0..10: return 'input-mini'
            case 11..20: return 'input-small'
            case 21..30: return 'input-medium'
            case 31..40: return 'input-large'
            default: return 'input-small'
        }
    }

    def row(model, out) {
        out << "<div class=\"row-fluid span12 space-after\">\n"
        if (model.align == 'right') {
            out << "<div class=\"pull-right\">\n"
        }
        def span = 12 / model.items.size()
        model.items.each { it ->
            AttributeMap at = new AttributeMap()
            at.addClass(it.css)
            at.addSpan("span${span}")
            out << "<span${at.toString()}>"
            out << INDENT << dataTag(it, 'data', false)
            out << "</span>"
        }
        if (model.align == 'right') {
            out << "</div>\n"
        }
        out << "</div>\n"
    }

    def grid(attrs, model, out) {
        out << "<div class=\"row-fluid span12\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered dyn ${model.source}\">\n"
        gridHeader attrs, model, out
        if (attrs.edit) {
            gridBodyEdit attrs, model, out
        } else {
            gridBodyView attrs, model, out
        }
        footerView attrs, model, out
        out << INDENT*3 << "</table>\n"
        out << INDENT*2 << "</div>\n"
    }

    def gridHeader(attrs, model, out) {
        out << INDENT*4 << "<thead><tr>"
        model.columns.each { col ->
            out << "<th>" + col.title + "</th>"
        }
        out << '\n' << INDENT*4 << "</tr></thead>\n"
    }

    def gridBodyEdit(attrs, model, out) {
        out << INDENT*4 << "<tbody>\n"
        model.rows.eachWithIndex { row, rowIndex ->
            def isComputed = getComputed(attrs, row.source, 'activeSigns')
            println isComputed
            AttributeMap at = new AttributeMap()
            at.addClass('shaded')
            if (row.strong) { at.addClass('strong')}
            out << INDENT*5 << "<tr>" << "<td${at.toString()}>" << row.title << "</td>" << "\n"
            model.columns[1..-1].eachWithIndex { col, colIndex ->
                out << INDENT*5 << "<td>"
                if (isComputed) {
                    out << "<span data-bind='text:data.${model.source}.get(${rowIndex},${colIndex})'></span>"
                } else {
                    out << "<input class='input-mini' data-bind='value:data.${model.source}.get(${rowIndex},${colIndex})'/>"
                }
                out << "</td>" << "\n"
            }
            out << INDENT*5 << "</tr>\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def gridBodyView(attrs, model, out) {
        out << INDENT*4 << "<tbody>\n"
        model.rows.eachWithIndex { row, rowIndex ->
            AttributeMap at = new AttributeMap()
            at.addClass('shaded')
            if (row.strong) { at.addClass('strong')}
            out << INDENT*5 << "<tr>" << "<td${at.toString()}>" << row.title << "</td>" << "\n"
            model.columns[1..-1].eachWithIndex { col, colIndex ->
                out << INDENT*5 << "<td>" <<
                    "<span data-bind='text:data.${model.source}.get(${rowIndex},${colIndex})'></span>" <<
                    "</td>" << "\n"
            }
            out << INDENT*5 << "</tr>\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def gridFooterView(attrs, model, out) {

    }

    def ter(attrs, model, out, index) {
        out << "<div class=\"row-fluid span12\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered dyn ${model.source}\">\n"
        terHeader attrs, out, index
        if (attrs.edit) {
            terBodyEdit attrs, out, index
        } else {
            terBodyView attrs, out, index
        }
        footerView attrs, model, out
        out << INDENT*3 << "</table>\n"
        out << INDENT*2 << "</div>\n"
    }

    def terHeader(attrs, out, index) {
        def ter = attrs.ter
        out << INDENT*4 << "<thead><tr>"
        ter.columns.eachWithIndex { col, i ->
            out << "<th>" + col.title + "</th>"
        }
        if (attrs.edit && ter.addRows) {
            out << "<th></th>"
        }
        out << '\n' << INDENT*4 << "</tr></thead>\n"
    }

    def terBodyView (attrs, out, index) {
        def ter = attrs.ter
        out << INDENT*4 << "<tbody data-bind=\"foreach: data.${ter.source}\"><tr>\n"
        ter.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, ter.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def terBodyEdit (attrs, out, index) {
        def ter = attrs.ter

        // body element
        out << INDENT*4 << "<tbody data-bind=\"template:{name:templateToUse, foreach: data.${ter.source}}\"></tbody>\n"

        // view template
        out << INDENT*4 << "<script id=\"viewTmpl\" type=\"text/html\"><tr>\n"
        ter.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, ter.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
        }
        if (ter.addRows) {
            out << INDENT*5 << "<td>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.editRow' href='#' title='edit'><i class='icon-edit'></i> Edit</a>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.removeRow' href='#' title='remove'><i class='icon-trash'></i> Remove</a>\n"
            out << INDENT*5 << "</td>\n"
        }
        out << INDENT*4 << "</tr></script>\n"

        // edit template
        out << INDENT*4 << "<script id=\"editTmpl\" type=\"text/html\"><tr>\n"
        ter.columns.eachWithIndex { col, i ->
            // mechanism for additional data binding clauses
            def bindAttrs = new DatabindingMap()
            if (i == 0) {bindAttrs.add 'hasFocus', 'isSelected'}
            // inject type from data model
            col.type = col.type ?: getType(attrs, col.source, ter.source)
            // inject computed from data model
            col.computed = col.computed ?: getComputed(attrs, col.source, ter.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', true, null, bindAttrs) << "</td>" << "\n"
        }
        if (ter.addRows) {
            out << INDENT*5 << "<td>\n"
            out << INDENT*6 << "<a class='btn btn-success btn-mini' data-bind='click:\$root.accept' href='#' title='save'>Update</a>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.cancel' href='#' title='cancel'>Cancel</a>\n"
            out << INDENT*5 << "</td>\n"
        }
        out << INDENT*4 << "</tr></script>\n"
    }

    def footerView(attrs, model, out) {
        def colCount = 0
        out << INDENT*4 << "<tfoot>\n"
        model.footer.rows.each { row ->
            colCount = 0
            out << INDENT*4 << "<tr>\n"
            row.columns.eachWithIndex { col, i ->
                def attributes = new AttributeMap()
                if (getAttribute(attrs, col.source, '', 'primaryResult') == 'true') {
                    attributes.addClass('value');
                }
                colCount += (col.colspan ? col.colspan.toInteger() : 1)
                def colspan = col.colspan ? " colspan='${col.colspan}'" : ''
                // inject type from data model
                col.type = col.type ?: getType(attrs, col.source, '')
                // inject computed from data model
                col.computed = col.computed ?: getComputed(attrs, col.source, '')
                out << INDENT*5 << "<td${colspan}>" << dataTag(col, 'data', attrs.edit, attributes) << "</td>" << "\n"
            }
            if (attrs.edit && model.addRows) {
                out << INDENT*5 << "<td></td>\n"  // to balance the extra column for actions
                colCount++
            }
            out << INDENT*4 << "</tr>\n"
        }
        if (attrs.edit && model.addRows) {
            out << INDENT*4 << """<tr><td colspan="${colCount}" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="click:addRow">
                        <i class="icon-plus"></i> Add a row</button>
                    </td></tr>\n"""
        }
        out << INDENT*4 << "</tfoot>\n"
    }

    /*------------ methods to look up attributes in the data model from the view model -------------*/

    def getType(attrs, name, context) {
        getAttribute(attrs, name, context, 'dataType')
    }

    def getComputed(attrs, name, context) {
        getAttribute(attrs, name, context, 'computed')
    }

    def getAttribute(attrs, name, context, attribute) {
        println "getting ${attribute} for ${name} in ${context}"
        def dataModel = attrs.model.dataModel
        def level = dataModel.find {it.name == context}
        level = level ?: dataModel
        println "level = ${level}"
        def target
        if (level.dataType in ['list','matrix']) {
            target = level.columns.find {it.name == name}
            if (!target) {
                target = level.rows.find {it.name == name}
            }
        }
        else {
            println "looking for ${name}"
            target = dataModel.find {it.name == name}
        }
        println "found ${attribute} = ${target ? target[attribute] : null}"
        return target ? target[attribute] : null
    }

    /*------------ JAVASCRIPT for dynamic content -------------*/

    def jsModelObjects = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                repeatingModel(attrs, mod, out)
            }
            else if (mod.dataType == 'matrix') {
                matrixModel attrs, mod, out
            }
        }
    }

    def jsViewModel = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                listViewModel(attrs, mod, out)
            }
            else if (mod.dataType == 'matrix') {
                matrixViewModel(attrs, mod, out)
            }
            else if (mod.computed) {
                computedViewModel(mod, out)
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

    def jsRemoveBeforeSave = { attrs ->
        if (attrs.model?.viewModel?.any({ it.dataType == 'tableWithEditableRows'})) {
            out << INDENT*4 << "delete jsData.selectedRow;\n"
        }
    }

    def computedViewModel(model, out) {
        out << "\n" << INDENT*3 << "self.data.${model.name} = ko.computed(function () {\n"
        if (model.computed.dependents.fromList) {
            out << INDENT*4 << "var total = 0;\n"
            out << INDENT*4 << "for(var i = 0; i < self.data.${model.computed.dependents.fromList}().length; i++) {\n"
            out << INDENT*5 << "var value = self.data.${model.computed.dependents.fromList}()[i].${model.computed.dependents.source}();\n"
            out << INDENT*6 << "total = total ${operators[model.computed.operation]} value; \n"
            out << INDENT*4 << "}\n"
            out << INDENT*4 << "return total;\n"
        }
        else if (model.computed.dependents.fromMatrix) {
            out << INDENT*4 << "var total = 0;\n"
            out << INDENT*4 << "var grid = self.data.${model.computed.dependents.fromMatrix};\n"
            // iterate columns and get value from model.computed.dependents.row
            out << INDENT*4 << "\$.each(grid, function (i,obj) {\n"
            out << INDENT*5 << "total = total ${operators[model.computed.operation]} obj.${model.computed.dependents.row}();\n"
            out << INDENT*4 << "});\n"
            out << INDENT*4 << "return total;\n"
        }
        out << INDENT*3 << "});\n"
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
                    case 'text':
                        out << INDENT*3 << "this['${col.name}'] = ko.protectedObservable(orBlank(data['${col.name}']));\n"
                        break;
                    case 'number':
                        out << INDENT*3 << "this['${col.name}'] = ko.protectedObservable(orZero(data['${col.name}']));\n"
                        break;
                    case 'boolean':
                        out << INDENT*3 << "this['${col.name}'] = ko.protectedObservable(orFalse(data['${col.name}']));\n"
                        break;
                }
            }
        }
        if (edit) {
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

    /*

     */
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
        out << INDENT*6 << "return " + numbers.join(" ${operators[model.computed.operation]} ") + ";\n"
        out << INDENT*5 << "});\n"
    }

    def listViewModel(attrs, model, out) {
        def rowModelName = makeRowModelName(model.name)
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
                newRow.isNew = true;
                self.data.${model.name}.push(newRow);
                self.editRow(newRow);
            };
            self.removeRow = function (row) {
                self.data.${model.name}.remove(row);
                self.selectedRow(null);
            };
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

    /*
            self.data.totalAreaCovered = ko.observable("${output.data?.totalAreaCovered}");
        }
 */
}

class AttributeMap {
    protected final static String QUOTE = "\""
    protected final static String SPACE = " "
    protected final static String EQUALS = "="
    protected final static String COMMA = ","
    protected final static String COLON = ":"
    private map = [:]
    protected separator = SPACE

    AttributeMap(String separator) {
        this.separator = separator
    }

    AttributeMap() {
    }

    def getMap() { return map }

    def add(key, value) {
        if (map.containsKey(key)) {
            map[key] = map[key] + separator + value
        } else {
            map[key] = value
        }
    }

    def addClass(value) {
        if (value) {
            add('class', value)
        }
    }

    def addSpan(value) {
        if (value && !this.classHasSpan()) {
            add('class', value)
        }
    }

    def classHasSpan() {
        return map.containsKey('class') && map.class.tokenize(' ').any {it.startsWith('span')}
    }

    String toString() {
        def strs = ['']
        map.each { k, v ->
            strs << k + EQUALS + QUOTE + v.encodeAsHTML() + QUOTE
        }
        strs.join separator
    }
}

class DatabindingMap extends AttributeMap {
    DatabindingMap() {
        super(COMMA)
    }

    def add(key, value) {
        map[key] = value
    }

    String toString() {
        map.collect({k,v -> k + COLON + v}).join separator
    }
}