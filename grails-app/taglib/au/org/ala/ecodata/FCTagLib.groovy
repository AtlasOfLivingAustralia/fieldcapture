package au.org.ala.ecodata

import static org.github.bootstrap.Attribute.outputAttributes

class FCTagLib {

    static namespace = "fc"

    def textField = { attrs ->
        def outerClass = attrs.remove 'outerClass'
        if (outerClass) {
            out << """<div class="${outerClass}">"""
        }
        def id = attrs.id ?: attrs.name
        def forAttr = id ? " for='${id}'" : ''
        def label = attrs.remove 'label'
        if (label) {
            out << """<label class="control-label" ${forAttr}>${label}</label>"""
        }
        def value = attrs.remove 'value'
        //println "${id}: ${value?.toString()}: ${value?.getClass()}"
        if (!value || value == 'null' || value?.toString() == 'null') { value = ""}
        def classes = attrs.remove('class')
        if (outerClass) {
            if (classes) {
                classes += ' span12'
            } else {
                classes = 'span12'
            }
        }
        log.debug "data-bind = " + attrs['data-bind']
        //def dataBind = attrs.remove('data-bind')

        //out << "<div class='controls'>"
        out << "<input type='text' class='${classes}' value='${value}' " << outputAttributes(attrs, out) << "/>"
        //out << "</div>"

        if (outerClass) {
            out << """</div>"""
        }
    }

    def textArea = { attrs ->
        def outerClass = attrs.remove 'outerClass'
        if (outerClass) {
            out << """<div class="${outerClass}">"""
        }
        def id = attrs.id ?: attrs.name
        def label = attrs.remove 'label'
        if (label) {
            out << """<label class="control-label" for="${id}">${label}</label>"""
        }
        def rows = attrs.rows ?: 3
        def value = attrs.remove 'value'
        if (!value || value == 'null' || value?.toString() == 'null') { value = ""}

        //out << "<div class='controls'>"
        out << "<textarea name='${id}' rows='${rows}' " << outputAttributes(attrs, out) << ">${value}</textarea>"
        //out << "</div>"

        if (outerClass) {
            out << """</div>"""
        }
    }

    /**
     * attr title
     * body content
     */
    def iconHelp = { attrs, body ->
        out <<
        """<a href="#" class="helphover" data-original-title="${attrs.title}"
 data-content="${body()}" ><i class="icon-question-sign"></i></a>"""
    }

}
