package au.org.ala.fieldcapture

import grails.converters.JSON

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
    private final static String DEFERRED_TEMPLATES_KEY = "deferredTemplates"

    private final static int LAYOUT_COLUMNS = 12 // Bootstrap scaffolding uses a 12 column layout.

    /*---------------------------------------------------*/
    /*------------ HTML for dynamic content -------------*/
    /*---------------------------------------------------*/

    /**
     * Main tag to insert html
     * @attrs model the data and view models
     * @attrs edit if true the html will support the editing of values
     */
    def modelView = { attrs ->
        viewModelItems(attrs, out, attrs.model?.viewModel)

        renderDeferredTemplates out
    }

    def viewModelItems(attrs, out, items) {

        items?.eachWithIndex { mod, index ->
            switch (mod.type) {
                case 'table':
                    table out, attrs, mod
                    break
                case 'grid':
                    grid out, attrs, mod
                    break
                case 'section':
                    section out, attrs, mod
                case 'row':
                    def span = LAYOUT_COLUMNS
                    row out, attrs, mod, span
                    break
                case 'photoPoints':
                    photoPoints out, attrs, mod, index
                    break
                case 'template':
                    out << g.render(template:mod.source)
                    break
            }
        }
    }

    /**
     * Generates an element to display or edit a value.
     * @parma attrs the attributes passed to the tag library.  Used to access site id.
     * @param model of the data element
     * @param context the dot notation path to the data
     * @param editable if the html element is an input
     * @param at any additional html attributes to output as a AttributeMap
     * @param databindAttrs additional clauses to add to the data binding
     * @return the markup
     */
    def dataTag(attrs, model, context, editable, at, databindAttrs, labelAttributes) {
        def result = ""
        if (!databindAttrs) { databindAttrs = new Databindings()}
        if (model.visibility) {
            databindAttrs.add "visible", evalDependency(model.visibility)
        }
        if (model.enabled) {
            databindAttrs.add "enable", evalDependency(model.enabled)
        }
        if (!at) { at = new AttributeMap()}
        if (!labelAttributes) { labelAttributes = new AttributeMap()}
        def validate = validationAttribute(model, editable)
        def toEdit = editable && !model.computed && !model.noEdit
        def matrix = model.type + '-' + (toEdit ? 'edit' : 'view')
        def source = (context ? context + '.' : '') + model.source
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
                result += "<input${at.toString()} name='${source}' data-bind='${databindAttrs.toString()}'${validate} type='checkbox' class='checkbox'/>"
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
                labelAttributes.addClass 'checkbox-list-label '
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
                break
            case 'image-edit':
                addDeferredTemplate('/output/fileUploadTemplate')
                databindAttrs.add 'fileUpload', source
                result += g.render(template: '/output/imageDataTypeTemplate', model: [databindAttrs:databindAttrs.toString(), source:source])
                break
            case 'embeddedImage-edit':
                addDeferredTemplate('/output/fileUploadTemplate')
                databindAttrs.add 'fileUpload', source
                result += g.render(template: '/output/imageDataTypeTemplate', model: [databindAttrs:databindAttrs.toString(), source:source])
                break
            case 'embeddedImage-view':
                databindAttrs.add "attr",  '{src: '+source+'().thumbnail_url}'
                result += "<img data-bind='${databindAttrs.toString()}'></img>"
                break
            case 'autocomplete-edit':
                def newAttrs = new Databindings()
                def link = g.createLink(controller: 'search', action:'species')
                newAttrs.add "hasfocus", "transients.focused"
                newAttrs.add "autocomplete", "{url:'${link}', render: renderItem, listId: list, result:speciesSelected}"
                newAttrs.add "visible", "transients.editing()"
                result += g.render(template: '/output/speciesTemplate', model:[source:source, databindAttrs: newAttrs.toString()])
                break
            case 'autocomplete-view':
                databindAttrs.add 'text', 'name'

                result += "<span data-bind=\"with: ${source}\"><span${at.toString()} data-bind='${databindAttrs.toString()}'></span></span>"
                break
            case 'photopoint-view':
            case 'photopoint-edit':
                result +="""
                <div><b><span data-bind="text:name"/></b></div>
                <div>Lat:<span data-bind="text:lat"/></div>
                <div>Lon:<span data-bind="text:lon"/></div>
                <div>Bearing:<span data-bind="text:bearing"/></div>
                """
                break
            case 'link-view':
            case 'link-edit':
                result+="<a href=\""+g.createLink(specialProperties(attrs, model.properties))+"\">${model.source}</a>"
                break
            case 'date-view':
                result += "<span data-bind=\"text:${source}.formattedDate\"></span>"
                break
            case 'date-edit':
                result +="<div class=\"input-append\"><input data-bind=\"datepicker:${source}.date\" type=\"text\" size=\"12\"${validate}/>"
                result +="<span class=\"add-on open-datepicker\"><i class=\"icon-th\"></i></span></div>"
                break

        }
        if (model.preLabel) {
            //labelAttributes.addClass 'label preLabel'
            result = "<span${labelAttributes.toString()}><label>${model.preLabel}</label></span>" + result
        }
        if (model.postLabel) {
            labelAttributes.addClass 'postLabel'
            result += "<span${labelAttributes.toString()}>${model.postLabel}</span>"
        }
        return result
    }

    def evalDependency(dependency) {
        if (dependency.source) {
            if (dependency.values) {
                return "jQuery.inArray(${dependency.source}(), ${dependency.values as JSON}) >= 0"
            }
            else if (dependency.value) {
                return "${depedency.source}() === ${dependency.value}"
            }
            return "${dependency.source}()"
        }
    }

    // convenience method for the above
    def dataTag(attrs, model, context, editable, at) {
        dataTag(attrs, model, context, editable, at, null, null)
    }

    // convenience method for the above
    def dataTag(attrs, model, context, editable) {
        dataTag(attrs, model, context, editable, null, null, null)
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

    def specialProperties(attrs, properties) {
        return properties.collectEntries { entry ->
            switch (entry.getValue()) {
                case "#siteId":
                    entry.setValue(attrs?.site?.siteId)
                default:
                    return entry
            }
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

    // form section
    def section(out, attrs, model) {

        if (model.title) {
            out << "<h4>${model.title}</h4>"
        }
        out << "<div class=\"row-fluid space-after output-section\">\n"

        viewModelItems(attrs, out, model.items)

        out << "</div>"
    }

    // row model
    def row(out, attrs, model, parentSpan) {
        def extraClassAttrs = model.class ?: ""
        def databindAttrs = model.visibility ? "data-bind=\"visible:${model.visibility}\"" : ""

        out << "<div class=\"row-fluid space-after ${extraClassAttrs}\" ${databindAttrs}>\n"
        if (model.align == 'right') {
            out << "<div class=\"pull-right\">\n"
        }
        items(out, attrs, model, parentSpan, 'row')
        if (model.align == 'right') {
            out << "</div>\n"
        }
        out << "</div>\n"
    }

    def items(out, attrs, model, parentSpan, context) {

        def span = context == 'row'? (int)(parentSpan / model.items.size()) : LAYOUT_COLUMNS

        model.items.each { it ->
            AttributeMap at = new AttributeMap()
            at.addClass(it.css)
            // inject computed from data model

            it.computed = it.computed ?: getComputed(attrs, it.source, '')
            if (it.type == 'col') {
                out << "<div class=\"span${span}\">\n"
                items(out, attrs, it, span, 'col')
                out << "</div>"
            }
            else if (it.type == 'table') {
                table out, attrs, it
            } else {
                // Wrap data elements in rows to reset the bootstrap indentation on subsequent spans to save the
                // model definition from needing to do so.
                def labelAttributes = new AttributeMap()
                if (context == 'col') {
                    out << "<div class=\"row-fluid\">"
                    labelAttributes.addClass 'span4'
                }
                if (it.type == 'textarea') {
                    out << INDENT << dataTag(attrs, it, 'data', attrs.edit, at, null, labelAttributes)
                } else {
                    at.addSpan("span${span}")
                    out << "<span${at.toString()}>"
                    out << INDENT << dataTag(attrs, it, 'data', attrs.edit, null, null, labelAttributes)
                    out << "</span>"
                }
                if (context == 'col') {
                    out << "</div>"
                }
            }
        }
    }

    def grid(out, attrs, model) {
        out << "<div class=\"row-fluid\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered ${model.source}\">\n"
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

    def table(out, attrs, model) {
        def extraClassAttrs = model.class ?: ""
        out << "<div class=\"row-fluid ${extraClassAttrs}\">\n"
        out << INDENT*3 << "<table class=\"table table-bordered ${model.source}\">\n"
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
            out << INDENT*5 << "<td>" << dataTag(attrs, col, '', false) << "</td>" << "\n"
        }
        out << INDENT*4 << "</tr></tbody>\n"
    }

    def tableBodyEdit (out, attrs, table) {
        // body elements for main rows
        if (attrs.edit) {
            def templateName = table.editableRows ? "${table.source}templateToUse" : "'${table.source}viewTmpl'"
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
                out << INDENT*5 << "<td>" << dataTag(attrs, col, '', false) << "</td>" << "\n"
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
        out << INDENT*4 << "<script id=\"${model.source}viewTmpl\" type=\"text/html\"><tr>\n"
        model.columns.eachWithIndex { col, i ->
            col.type = col.type ?: getType(attrs, col.source, model.source)
            //log.debug "col = ${col}"
            out << INDENT*5 << "<td>" << dataTag(attrs, col, '', edit) << "</td>" << "\n"
        }
        if (model.editableRows) {
                out << INDENT*5 << "<td>\n"
                out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.edit${model.source}Row' href='#' title='edit'><i class='icon-edit'></i> Edit</a>\n"
                out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.remove${model.source}Row' href='#' title='remove'><i class='icon-trash'></i> Remove</a>\n"
                out << INDENT*5 << "</td>\n"
        } else {
            if (edit) {
                out << INDENT*5 << "<td><i data-bind='click:\$root.remove${model.source}Row' class='icon-remove'></i></td>\n"
            }
        }
        out << INDENT*4 << "</tr></script>\n"
    }

    def tableEditTemplate(out, attrs, model) {
        out << INDENT*4 << "<script id=\"${model.source}editTmpl\" type=\"text/html\"><tr>\n"
        model.columns.eachWithIndex { col, i ->
            def edit = !col['readOnly'];
            // mechanism for additional data binding clauses
            def bindAttrs = new Databindings()
            if (i == 0) {bindAttrs.add 'hasFocus', 'isSelected'}
            // inject type from data model
            col.type = col.type ?: getType(attrs, col.source, model.source)
            // inject computed from data model
            col.computed = col.computed ?: getComputed(attrs, col.source, model.source)
            out << INDENT*5 << "<td>" << dataTag(attrs, col, '', edit, null, bindAttrs, null) << "</td>" << "\n"
        }
        out << INDENT*5 << "<td>\n"
        out << INDENT*6 << "<a class='btn btn-success btn-mini' data-bind='click:\$root.accept${model.source}' href='#' title='save'>Update</a>\n"
        out << INDENT*6 << "<a class='btn btn-mini' data-bind='click:\$root.cancel${model.source}' href='#' title='cancel'>Cancel</a>\n"
        out << INDENT*5 << "</td>\n"
        out << INDENT*4 << "</tr></script>\n"
    }

    /**
     * Common footer output for both tables and grids.
     */
    def footer(out, attrs, model) {

        def colCount = 0
        out << INDENT*4 << "<tfoot>\n"
        model.footer?.rows.each { row ->
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
                out << INDENT*5 << "<td${colspan}>" << dataTag(attrs, col, 'data', attrs.edit, attributes) << "</td>" << "\n"
            }
            if (model.type == 'table' && attrs.edit) {
                out << INDENT*5 << "<td></td>\n"  // to balance the extra column for actions
                colCount++
            }
            out << INDENT*4 << "</tr>\n"
        }
        if (attrs.edit && model.userAddedRows) {
            out << INDENT*4 << """<tr><td colspan="${colCount}" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="click:add${model.source}Row">
                        <i class="icon-plus"></i> Add a row</button>
                    </td></tr>\n"""
        }
        out << INDENT*4 << "</tfoot>\n"
    }

    def photoPoints(out, attrs, model, index) {
        table out, attrs, model
    }

    def addDeferredTemplate(name) {
        def templates = pageScope.getVariable(DEFERRED_TEMPLATES_KEY);
        if (!templates) {
            templates = []
            pageScope.setVariable(DEFERRED_TEMPLATES_KEY, templates);
        }
        templates.add(name)
    }

    def renderDeferredTemplates(out) {

        // some templates need to be rendered after the rest of the view code as it was causing problems when they were
        // embedded inside table view/edit templates. (as happened if an image type was included in a table row).
        def templates = pageScope.getVariable(DEFERRED_TEMPLATES_KEY)
        templates?.each {
            out << g.render(template: it)
        }
        pageScope.setVariable(DEFERRED_TEMPLATES_KEY, null)
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

