package au.org.ala.fieldcapture
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
                case 'table':
                    table out, attrs, mod, index
                    break
                case 'grid':
                    grid out, attrs, mod
                    break
                case 'row':
                    row out, attrs, mod
                    break
                case 'photoPoints':
                    photoPoints out, attrs, mod, index
                    break
            }
        }
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
        if (!databindAttrs) { databindAttrs = new Databindings()}
        if (!at) { at = new AttributeMap()}
        def validate = validationAttribute(model, editable)
        def toEdit = editable && !model.computed && !model.noEdit
        def matrix = model.type + '-' + (toEdit ? 'edit' : 'view')
        def source = (context ? context + '.' : '') + model.source
        def labelClasses = ''
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
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}'${validate} type='text' class='input-small'/>"
                break
            case 'number-edit':
                at.addClass getInputSize(model.width)
                at.add 'style','text-align:center'
                databindAttrs.add 'value', source
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}'${validate} type='text' class='input-mini'/>"
                break
            case 'boolean-view':
                databindAttrs.add 'visible', source
                result += "<i data-bind='${databindAttrs.toString()}' class='icon-ok'></i>"
                break
            case 'boolean-edit':
                databindAttrs.add 'checked', source
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}'${validate} type='checkbox' class='checkbox'/>"
                break
            case 'textarea-view':
                databindAttrs.add 'text', source
                result += "<span${at.toString()} data-bind='${databindAttrs.toString()}'></span>"
                break
            case 'textarea-edit':
                databindAttrs.add 'value', source
                result += "<textarea${at.toString()} data-bind='${databindAttrs.toString()}'></textarea>"
                break
            case 'simpleDate-view':
            case 'simpleDate-edit':
                databindAttrs.add 'datepicker', source + '.date'
                result += "<input${at.toString()} data-bind='${databindAttrs.toString()}'${validate} type='text' class='input-small'/>"
                break
            case 'selectOne-view':
            case 'selectMany-view':
                databindAttrs.add 'text',source
                result += "<span${at.toString()} data-bind='${databindAttrs.toString()}'></span>"
                break
            case 'selectOne-edit':
                databindAttrs.add 'value', source
                // Select one or many view types require that the data model has defined a set of valid options
                // to select from.
                databindAttrs.add 'options', 'transients.'+model.source+'Constraints'

                result += "<select${at.toString()} data-bind='${databindAttrs.toString()}'${validate}></select>"
                break
            case 'selectMany-edit':
                labelClasses += 'checkbox-list-label '
                def constraints = 'transients.'+model.source+'Constraints'
                databindAttrs.add 'value', '\$data'
                databindAttrs.add 'checked', "\$root.${source}"
                result += """
                    <ul class="checkbox-list" data-bind="foreach: ${constraints}">
                        <li>
                            <input type="checkbox" name="${source}" data-bind="${databindAttrs.toString()}"${validate}/> <span data-bind="text:\$data"></span>
                        </li>
                    </ul>
                """
                break
            case 'image-view':
                databindAttrs.add "attr",  '{src: '+source+'.thumbnail_url}'
                result += "<img data-bind='${databindAttrs.toString()}'></img>"
                break;
            case 'image-edit':
                addTemplate('fileUploadTemplate')
                databindAttrs.add 'fileUpload', source
                result += g.render(template: 'imageDataTypeTemplate', model: [databindAttrs:databindAttrs.toString()])
                break;
            case 'embeddedImage-edit':
                addTemplate('fileUploadTemplate')
                databindAttrs.add 'fileUpload', source
                result += g.render(template: 'imageDataTypeTemplate', model: [databindAttrs:databindAttrs.toString()])
                break;
            case 'embeddedImage-view':
                databindAttrs.add "attr",  '{src: '+source+'().thumbnail_url}'
                result += "<img data-bind='${databindAttrs.toString()}'></img>"
                break;
        }
        if (model.preLabel) {
            result = "<span class='${labelClasses}label preLabel'>${model.preLabel}</span>" + result
        }
        if (model.postLabel) {
            result += "<span class='postLabel'>${model.postLabel}</span>"
        }
        return result
    }

    // convenience method for the above
    def dataTag(model, context, editable, at) {
        dataTag(model, context, editable, at, null)
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

    // -------- validation declarations --------------------
    def validationAttribute(model, edit) {
        //log.debug "checking validation for ${model}, edit = ${edit}"
        if (!edit) { return ""}  // don't bother if the user can't change it
        if (!model.validate) { return ""} // no criteria
        // collect the validation criteria
        def criteria = model.validate.tokenize(',')
        criteria = criteria.collect { it.trim() }
        def values = []
        criteria.each {
            switch (it) {
                case 'required':
                    if (model.type == 'selectMany') {
                        values << 'minCheckbox[1]'
                    }
                    else {
                        values << it
                    }
                    break
                case 'number':
                    values << 'custom[number]'
                    break
                case it.startsWith('min:'):
                    values << it
                    break
                default:
                    values << it
            }
        }
        //log.debug " data-validation-engine='validate[${values.join(',')}]'"
        return " data-validation-engine='validate[${values.join(',')}]'"
    }

    // row model
    def row(out, attrs, model) {
        out << "<div class=\"row-fluid space-after\">\n"
        if (model.align == 'right') {
            out << "<div class=\"pull-right\">\n"
        }
        def span = 12 / model.items.size()
        model.items.each { it ->
            AttributeMap at = new AttributeMap()
            at.addClass(it.css)
            // inject computed from data model
            it.computed = it.computed ?: getComputed(attrs, it.source, '')
            if (it.type == 'textarea') {
                out << INDENT << dataTag(it, 'data', attrs.edit, at)
            } else {
                at.addSpan("span${span}")
                out << "<span${at.toString()}>"
                out << INDENT << dataTag(it, 'data', attrs.edit)
                out << "</span>"
            }
        }
        if (model.align == 'right') {
            out << "</div>\n"
        }
        out << "</div>\n"
    }

    def grid(out, attrs, model) {
        out << "<div class=\"row-fluid\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered dyn ${model.source}\">\n"
        gridHeader out, attrs, model
        if (attrs.edit) {
            gridBodyEdit out, attrs, model
        } else {
            gridBodyView out, attrs, model
        }
        footer out, attrs, model
        out << INDENT*3 << "</table>\n"
        out << INDENT*2 << "</div>\n"
    }

    def gridHeader(out, attrs, model) {
        out << INDENT*4 << "<thead><tr>"
        model.columns.each { col ->
            out << "<th>"
            out << col.title
            if (col.pleaseSpecify) {
                def ref = col.pleaseSpecify.source
                // $ means top-level of data
                if (ref.startsWith('$')) { ref = 'data.' + ref[1..-1] }
                if (attrs.edit) {
                    out << " (<span data-bind='clickToEdit:${ref}' data-input-class='input-mini' data-prompt='specify'></span>)"
                } else {
                    out << " (<span data-bind='text:${ref}'></span>)"
                }
            }
            out << "</th>"
        }
        out << '\n' << INDENT*4 << "</tr></thead>\n"
    }

    def gridBodyEdit(out, attrs, model) {
        out << INDENT*4 << "<tbody>\n"
        model.rows.eachWithIndex { row, rowIndex ->

            // >>> output the row heading cell
            AttributeMap at = new AttributeMap()
            at.addClass('shaded')  // shade the row heading
            if (row.strong) { at.addClass('strong') } // bold the heading if so specified
            // row and td tags
            out << INDENT*5 << "<tr>" << "<td${at.toString()}>"
            out << row.title
            if (row.pleaseSpecify) { //handles any requirement to allow the user to specify the row heading
                def ref = row.pleaseSpecify.source
                // $ means top-level of data
                if (ref.startsWith('$')) { ref = 'data.' + ref[1..-1] }
                out << " (<span data-bind='clickToEdit:${ref}' data-input-class='input-small' data-prompt='specify'></span>)"
            }
            // close td
            out << "</td>" << "\n"

            // find out if the cells in this row are computed
            def isComputed = getComputed(attrs, row.source, model.source)
            // >>> output each cell in the row
            model.columns[1..-1].eachWithIndex { col, colIndex ->
                out << INDENT*5 << "<td>"
                if (isComputed) {
                    out << "<span data-bind='text:data.${model.source}.get(${rowIndex},${colIndex})'></span>"
                } else {
                    out << "<span data-bind='ticks:data.${model.source}.get(${rowIndex},${colIndex})'></span>"
                    //out << "<input class='input-mini' data-bind='value:data.${model.source}.get(${rowIndex},${colIndex})'/>"
                }
                out << "</td>" << "\n"
            }

            out << INDENT*5 << "</tr>\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def gridBodyView(out, attrs, model) {
        out << INDENT*4 << "<tbody>\n"
        model.rows.eachWithIndex { row, rowIndex ->

            // >>> output the row heading cell
            AttributeMap at = new AttributeMap()
            at.addClass('shaded')
            if (row.strong) { at.addClass('strong')}
            // row and td tags
            out << INDENT*5 << "<tr>" << "<td${at.toString()}>"
            out << row.title
            if (row.pleaseSpecify) { //handles any requirement to allow the user to specify the row heading
                def ref = row.pleaseSpecify.source
                // $ means top-level of data
                if (ref.startsWith('$')) { ref = 'data.' + ref[1..-1] }
                out << " (<span data-bind='text:${ref}'></span>)"
            }
            // close td
            out << "</td>" << "\n"

            // >>> output each cell in the row
            model.columns[1..-1].eachWithIndex { col, colIndex ->
                out << INDENT*5 << "<td>" <<
                    "<span data-bind='text:data.${model.source}.get(${rowIndex},${colIndex})'></span>" <<
                    "</td>" << "\n"
            }

            out << INDENT*5 << "</tr>\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def table(out, attrs, model, index) {
        out << "<div class=\"row-fluid\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered dyn ${model.source}\">\n"
        tableHeader out, attrs, model
        tableBodyEdit out, attrs, model
        footer out, attrs, model
        out << INDENT*3 << "</table>\n"
        out << INDENT*2 << "</div>\n"
    }

    def tableHeader(out, attrs, table) {
        out << INDENT*4 << "<thead><tr>"
        table.columns.eachWithIndex { col, i ->
            out << "<th>" + col.title + "</th>"
        }
        if (attrs.edit) {
            out << "<th></th>"
        }
        out << '\n' << INDENT*4 << "</tr></thead>\n"
    }

    def tableBodyView (out, attrs, table) {
        out << INDENT*4 << "<tbody data-bind=\"foreach: data.${table.source}\"><tr>\n"
        table.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, table.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def tableBodyEdit (out, attrs, table) {
        // body elements for main rows
        if (attrs.edit) {
            def templateName = table.editableRows ? 'templateToUse' : "'viewTmpl'"
            out << INDENT*4 << "<tbody data-bind=\"template:{name:${templateName}, foreach: data.${table.source}}\"></tbody>\n"
            if (table.editableRows) {
                // write the view template
                tableViewTemplate(out, attrs, table, false)
                // write the edit template
                tableEditTemplate(out, attrs, table)
            } else {
                // write the view template
                tableViewTemplate(out, attrs, table, attrs.edit)
            }
        } else {
            out << INDENT*4 << "<tbody data-bind=\"foreach: data.${table.source}\"><tr>\n"
            table.columns.eachWithIndex { col, i ->
                col.type = col.type ?: getType(attrs, col.source, table.source)
                out << INDENT*5 << "<td>" << dataTag(col, '', false) << "</td>" << "\n"
            }
            out << INDENT*4 << "</tr></tbody>\n"
        }

        // body elements for additional rows (usually summary rows)
        if (table.rows) {
            out << INDENT*4 << "<tbody>\n"
            table.rows.each { tot ->
                def at = new AttributeMap()
                if (tot.showPercentSymbol) { at.addClass('percent') }
                out << INDENT*4 << "<tr>\n"
                table.columns.eachWithIndex { col, i ->
                    if (i == 0) {
                        out << INDENT*4 << "<td>${tot.title}</td>\n"
                    } else {
                        // assume they are all computed for now
                        out << INDENT*5 << "<td>" <<
                          "<span${at.toString()} data-bind='text:data.frequencyTotals().${col.source}.${tot.source}'></span>" <<
                          "</td>" << "\n"
                    }
                }
                if (attrs.edit) {
                    out << INDENT*5 << "<td></td>\n"
                }
                out << INDENT*4 << "</tr>\n"
            }
            out << INDENT*4 << "</tbody>\n"
        }
    }

    def tableViewTemplate(out, attrs, model, edit) {
        out << INDENT*4 << "<script id=\"viewTmpl\" type=\"text/html\"><tr>\n"
        model.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, model.source)
            //log.debug "col = ${col}"
            out << INDENT*5 << "<td>" << dataTag(col, '', edit) << "</td>" << "\n"
        }
        if (model.editableRows) {
                out << INDENT*5 << "<td>\n"
                out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.editRow' href='#' title='edit'><i class='icon-edit'></i> Edit</a>\n"
                out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.removeRow' href='#' title='remove'><i class='icon-trash'></i> Remove</a>\n"
                out << INDENT*5 << "</td>\n"
        } else {
            if (edit) {
                out << INDENT*5 << "<td><i data-bind='click:\$root.removeRow' class='icon-remove'></i></td>\n"
            }
        }
        out << INDENT*4 << "</tr></script>\n"
    }

    def tableEditTemplate(out, attrs, model) {
        out << INDENT*4 << "<script id=\"editTmpl\" type=\"text/html\"><tr>\n"
        model.columns.eachWithIndex { col, i ->
            def edit = !col['readOnly'];
            // mechanism for additional data binding clauses
            def bindAttrs = new Databindings()
            if (i == 0) {bindAttrs.add 'hasFocus', 'isSelected'}
            // inject type from data model
            col.type = col.type ?: getType(attrs, col.source, model.source)
            // inject computed from data model
            col.computed = col.computed ?: getComputed(attrs, col.source, model.source)
            out << INDENT*5 << "<td>" << dataTag(col, '', edit, null, bindAttrs) << "</td>" << "\n"
        }
        out << INDENT*5 << "<td>\n"
        out << INDENT*6 << "<a class='btn btn-success btn-mini' data-bind='click:\$root.accept' href='#' title='save'>Update</a>\n"
        out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.cancel' href='#' title='cancel'>Cancel</a>\n"
        out << INDENT*5 << "</td>\n"
        out << INDENT*4 << "</tr></script>\n"
    }

    /**
     * Common footer output for both tables and grids.
     */
    def footer(out, attrs, model) {
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
            if (model.type == 'table' && attrs.edit) {
                out << INDENT*5 << "<td></td>\n"  // to balance the extra column for actions
                colCount++
            }
            out << INDENT*4 << "</tr>\n"
        }
        if (attrs.edit && model.userAddedRows) {
            out << INDENT*4 << """<tr><td colspan="${colCount}" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="click:addRow">
                        <i class="icon-plus"></i> Add a row</button>
                    </td></tr>\n"""
        }
        out << INDENT*4 << "</tfoot>\n"
    }

    def photoPoints(out, attrs, model, index) {
        table out, attrs, model, index
    }

    def addTemplate(name) {
        def templates = pageScope.getVariable("templates");
        if (!templates) {
            templates = []
            pageScope.setVariable("templates", templates);
        }
        templates.add(name)
    }

    /*------------ methods to look up attributes in the data model -------------*/

    static String getType(attrs, name, context) {
        getAttribute(attrs, name, context, 'dataType')
    }

    static String getComputed(attrs, name, context) {
        getAttribute(attrs, name, context, 'computed')
    }

    static String getAttribute(attrs, name, context, attribute) {
        //println "getting ${attribute} for ${name} in ${context}"
        def dataModel = attrs.model.dataModel
        def level = dataModel.find {it.name == context}
        level = level ?: dataModel
        //println "level = ${level}"
        def target
        if (level.dataType in ['list','matrix', 'photoPoints']) {
            target = level.columns.find {it.name == name}
            if (!target) {
                target = level.rows.find {it.name == name}
            }
        }
        else {
            //println "looking for ${name}"
            target = dataModel.find {it.name == name}
        }
        //println "found ${attribute} = ${target ? target[attribute] : null}"
        return target ? target[attribute] : null
    }

    def getAttribute(model, name) {
        def target = null
        model.each( {
            if (it.name == name) {
                target = it
                return target
            }
            else if (it?.dataType == 'list') {
                target = getAttribute(it.columns, name)
                if (target) {
                    return target
                }
            }
        })
        return target
    }

}

