package au.org.ala.fieldcapture

import groovy.xml.MarkupBuilder

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
        log.trace "data-bind = " + attrs['data-bind']
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

    def initialiseState = { attrs, body ->
        switch (body()) {
            case 'Queensland': out << 'QLD'; break
            case 'Victoria': out << 'VIC'; break
            case 'Tasmania': out << 'TAS'; break
            default:
                def words = body().tokenize(' ')
                out << words.collect({it[0]}).join()
        }
    }

    /**
     * @attr active
     */
    def navbar = { attrs ->

        def mb = new MarkupBuilder(out)

        mb.ul(class:'nav') {
            li(class:attrs.active == 'home' ? 'active' : '') {
                a(href:createLink(uri: '/')) {
                    i(class:"icon-home") {
                        mkp.yieldUnescaped("&nbsp;")
                    }
                    mkp.yieldUnescaped("&nbsp")
                    mkp.yield(message(code:'default.home.label', default: 'Home'))}
            }
            li(class:attrs.active == 'about' ? 'active' : '') {
                a(href:createLink(controller: 'about')) {
                    i(class:"icon-question-sign") {
                        mkp.yieldUnescaped("&nbsp;")
                    }
                    mkp.yieldUnescaped("&nbsp")
                    mkp.yield(message(code:'default.about.label', default: 'About'))
                }
            }
        }

    }

    def navSeparator = { attrs, body ->
        out << "&nbsp;&#187;&nbsp;"
    }

    /**
     * @attr active
     * @attr title
     * @attr href
     */
    def breadcrumbItem = { attrs, body ->
        def active = attrs.active
        if (!active) {
            active = attrs.title
        }
        def current = pageProperty(name:'page.pageTitle')?.toString()

        def mb = new MarkupBuilder(out)
        mb.li(class: active == current ? 'active' : '') {
            a(href:attrs.href) {
                i(class:'icon-chevron-right') { mkp.yieldUnescaped('&nbsp;')}
                mkp.yield(attrs.title)
            }
        }
    }

    /**
     * Output search counts in the form of:
     *
     * "1 to 10 of 133"
     *
     * @attr offset
     * @attr max
     * @attr total
     */
    def searchResultsCounts = { attrs, body ->
        def first = (attrs.offset?.toInteger()?:0) + 1
        def last = (attrs.offset?.toInteger()?:0) + attrs.max?.toInteger()?:10
        def total = attrs.total?.toInteger()
        def highest = (total > last) ? last : total

        if (total > 0) {
            out << "Showing " + first + " to " + highest + " of " + total + " for "
        } else {
            out << "No records found for "
        }

    }

}
