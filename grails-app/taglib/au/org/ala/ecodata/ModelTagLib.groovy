package au.org.ala.ecodata

class ModelTagLib {

    static namespace = "md"

    private final static INDENT = "    "
    private final static operators = ['sum':'+', 'times':'*']
    private final static String QUOTE = "\"";
    private final static String SPACE = " ";
    private final static String EQUALS = "=";

    /*------------ STYLES for dynamic content -------------*/
    // adds a style block for the dynamic components
    def modelStyles = { attrs ->
        attrs.model?.viewModel?.each { mod ->
            switch (mod.type) {
                case 'tableWithEditableRows':
                    attrs.grid = mod
                    gridStyle(attrs, out)
            }
        }
    }

    def gridStyle(attrs, out ) {
        def grid = attrs.grid
        def edit = attrs.edit

        out << '<style type="text/css">\n'
        grid.columns.eachWithIndex { col, i ->
            def width = col.width ? "width:${col.width};" : ""
            def textAlign = getTextAlign(attrs, col, grid.source)
            if (width || textAlign) {
                out << INDENT*2 << "table.grid td:nth-child(${i+1}) {${width}${textAlign}}\n"
            }
        }
        // add extra column for edit buttons
        if (edit && grid.addRows) {
            out << INDENT*2 << "table.grid td:last-child {width:20%;text-align:center;}\n"
        }
        out << INDENT << "</style>"
    }

    def getTextAlign(attrs, col, context) {
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
                    attrs.grid = mod
                    grid attrs, out, index
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
     * @param attrs any additional html attributes to output as a AttributeMap
     * @param databindAttrs additional clauses to add to the data binding
     * @return the markup
     */
    def dataTag(model, context, editable, attrs, databindAttrs) {
        if (!databindAttrs) { databindAttrs = new DatabindingMap()}
        if (!attrs) { attrs = new AttributeMap()}
        def toEdit = editable && !model.computed && !model.noEdit
        def matrix = model.type + '-' + (toEdit ? 'edit' : 'view')
        def source = (context ? context + '.' : '') + model.source
        switch (matrix) {
            case 'literal-edit':
            case 'literal-view':
                return "<span${attrs.toString()}>${model.source}</span>" // don't include context in literals
            case 'text-view':
            case 'number-view':
                databindAttrs.add 'text',source
                return "<span${attrs.toString()} data-bind='${databindAttrs.toString()}'></span>"
            case 'text-edit':
                attrs.addClass getInputSize(model.width)
                databindAttrs.add 'value', source
                return "<input${attrs.toString()} data-bind='${databindAttrs.toString()}' type='text' class='input-small'/>"
            case 'number-edit':
                attrs.add 'style','text-align:center'
                databindAttrs.add 'value', source
                return "<input${attrs.toString()} data-bind='${databindAttrs.toString()}' type='text' class='input-mini'/>"
            case 'boolean-view':
                databindAttrs.add 'visible', source
                return "<i data-bind='${databindAttrs.toString()}' class='icon-ok'></i>"
            case 'boolean-edit':
                databindAttrs.add 'checked', source
                return "<input${attrs.toString()} data-bind='${databindAttrs.toString()}' type='checkbox' class='checkbox'/>"
            default:
                return ""
        }
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
            out << "<div class=\"pull-right span8\">\n"
        }
        model.items.each { it ->
            def dataBind = dataBinding(it, "data", false)
            def body = (it.type == 'literal') ? it.source : ''
            def cssClasses = ['center']
            if (it.css) { cssClasses << it.css }
            def cssClass = cssClasses ? " class='${cssClasses.join(' ')}'" : ""
            out << INDENT << "<span${dataBind}${cssClass}>${body}</span>"
        }
        if (model.align == 'right') {
            out << "</div>\n"
        }
        out << "</div>\n"
    }

    def grid(attrs, out, index) {
        out << "<div class=\"row-fluid span12\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered grid\">\n"
        gridHeader attrs, out, index
        if (attrs.edit) {
            gridBodyEdit attrs, out, index
        } else {
            gridBodyView attrs, out, index
        }
        gridFooterView attrs, out
        out << INDENT*3 << "</table>\n"
        out << INDENT*2 << "</div>\n"
    }

    def gridHeader(attrs, out, index) {
        def grid = attrs.grid
        out << INDENT*4 << "<thead><tr>"
        grid.columns.eachWithIndex { col, i ->
            out << "<th>" + col.title + "</th>"
        }
        if (attrs.edit && grid.addRows) {
            out << "<th></th>"
        }
        out << '\n' << INDENT*4 << "</tr></thead>\n"
    }

    def gridBodyView (attrs, out, index) {
        def grid = attrs.grid
        out << INDENT*4 << "<tbody data-bind=\"foreach: data.${grid.source}\"><tr>\n"
        grid.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, grid.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def gridBodyEdit (attrs, out, index) {
        def grid = attrs.grid

        // body element
        out << INDENT*4 << "<tbody data-bind=\"template:{name:templateToUse, foreach: data.${grid.source}}\"></tbody>\n"

        // view template
        out << INDENT*4 << "<script id=\"viewTmpl\" type=\"text/html\"><tr>\n"
        grid.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, grid.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
        }
        if (grid.addRows) {
            out << INDENT*5 << "<td>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.editRow' href='#' title='edit'><i class='icon-edit'></i> Edit</a>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.removeRow' href='#' title='remove'><i class='icon-trash'></i> Remove</a>\n"
            out << INDENT*5 << "</td>\n"
        }
        out << INDENT*4 << "</tr></script>\n"

        // edit template
        out << INDENT*4 << "<script id=\"editTmpl\" type=\"text/html\"><tr>\n"
        grid.columns.eachWithIndex { col, i ->
            // mechanism for additional data binding clauses
            def bindAttrs = new DatabindingMap()
            if (i == 0) {bindAttrs.add 'hasFocus', 'isSelected'}
            // inject type from data model
            col.type = col.type ?: getType(attrs, col.source, grid.source)
            // inject computed from data model
            col.computed = col.computed ?: getComputed(attrs, col.source, grid.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', true, null, bindAttrs) << "</td>" << "\n"
        }
        if (grid.addRows) {
            out << INDENT*5 << "<td>\n"
            out << INDENT*6 << "<a class='btn btn-success btn-mini' data-bind='click:\$root.accept' href='#' title='save'>Update</a>\n"
            out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.cancel' href='#' title='cancel'>Cancel</a>\n"
            out << INDENT*5 << "</td>\n"
        }
        out << INDENT*4 << "</tr></script>\n"
    }

    def gridFooterView (attrs, out) {
        def colCount = 0
        def grid = attrs.grid
        out << INDENT*4 << "<tfoot>\n"
        grid.footer.rows.each { row ->
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
            if (attrs.edit && grid.addRows) {
                out << INDENT*5 << "<td></td>\n"  // to balance the extra column for actions
                colCount++
            }
            out << INDENT*4 << "</tr>\n"
        }
        if (attrs.edit && grid.addRows) {
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
        log.debug "getting ${attribute} for ${name} in ${context}"
        def dataModel = attrs.model.dataModel
        def level = dataModel.find {it.name == context}
        level = level ?: dataModel
        log.debug "level = ${level}"
        def target
        if (level.dataType == 'list') {
            target = level.columns.find {it.name == name}
        }
        else {
            target = dataModel.find {it.name == name}
        }
        return target ? target[attribute] : null
    }

    /*------------ JAVASCRIPT for dynamic content -------------*/

    def jsModelObjects = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                repeatingModel(attrs, mod, out)
            }
        }
    }

    def jsViewModel = { attrs ->
        attrs.model?.dataModel?.each { mod ->
            if (mod.dataType == 'list') {
                listViewModel(attrs, mod, out)
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
            out << INDENT*3 << "});\n"
        }
    }

    def makeRowModelName(name) {
        def rowModelName = "${name}Row"
        return rowModelName[0].toUpperCase() + rowModelName.substring(1)
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
                        out << INDENT*3 << "this['${col.name}'] = ko.computed(function () {\n"
                        // must be at least one dependant
                        def numbers = []
                        def checkNumberness = []
                        col.computed.dependents.each {
                            numbers << "Number(self['${it}']())"
                            checkNumberness << "isNaN(Number(self['${it}']()))"
                        }
                        out << INDENT*4 << "if (" + checkNumberness.join(' || ') + ") { return 0; }\n"
                        out << INDENT*4 << "return " + numbers.join(' * ') + ";\n"
                        out << INDENT*3 << "});\n"
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
        add('class', value)
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