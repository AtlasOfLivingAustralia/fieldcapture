package au.org.ala.fieldcapture

import au.org.ala.cas.util.AuthenticationCookieUtils
import groovy.xml.MarkupBuilder
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

import static org.github.bootstrap.Attribute.outputAttributes

class FCTagLib {

    static namespace = "fc"

    def commonService
    def userService

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
     * @attr name
     * @attr targetField
     * @attr printable
     * @attr size optionally overrides the bootstrap size class for the input
     */
    def datePicker = { attrs ->
        /**
            <input data-bind="datepicker:startDate.date" name="startDate" id="startDate" type="text" size="16"
                data-validation-engine="validate[required]" class="input-xlarge"/>
            <span class="add-on open-datepicker"><i class="icon-th"></i></span>
         */

        def mb = new MarkupBuilder(out)

        def inputAttrs = [
            "data-bind":"datepicker:${attrs.targetField}",
            name:"${attrs.name}",
            id:"${attrs.id ?: attrs.name}",
            type:'text',
            size:'16',
            class: attrs.size ?: 'input-xlarge'
        ]

        def ignoreList = ['name', 'id']
        attrs.each {
            if (!ignoreList.contains(it.key)) {
                inputAttrs[it.key] = it.value
            }
        }

        if (attrs.required) {
            inputAttrs["data-validation-engine"] = "validate[required]"
        }

        mb.input(inputAttrs) {
        }
        if (!attrs.printable) {
            mb.span(class:'add-on open-datepicker') {
                mb.i(class:'icon-th') {
                    mkp.yieldUnescaped("&nbsp;")
                }
            }
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
            li(class:attrs.active == 'dashboard' ? 'active' : '') {
                a(href:createLink(controller: 'report', action:'dashboard')) {
                    i(class:"icon-signal") {
                        mkp.yieldUnescaped("&nbsp;")
                    }
                    mkp.yieldUnescaped("&nbsp")
                    mkp.yield(message(code:'default.about.label', default: 'Dashboard'))
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
     * "Showing 1 to 10 of 133 for "
     * TODO: encode words as i18n props
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

    /**
     * Tag to simplify formatting a date from string
     *
     * <g:formatDate date="${Date.parse("yyyy-MM-dd'T'HH:mm:ss'Z'" , dateString)}" format="yyyy-MM-dd"/>
     *
     * @attr format
     * @attr date REQUIRED
     * @attr inputFormat optional
     *
     */
    def formatDateString = { attrs, body ->
        def inputFormat = attrs.inputFormat?:"yyyy-MM-dd'T'HH:mm:ss'Z'"
        def formattedDate = g.formatDate(
                date: Date.parse(inputFormat, attrs.date),
                format: attrs.format?:"yyyy-MM-dd"
        )
        out << formattedDate
    }

    /**
     * Given an entityType (e.g. au.org.ala.ecodata.Activity) output its controller name
     * for use in a g:link taglib.
     *
     * @attr entityType REQUIRED
     */
    def getControllerNameFromEntityType = { attrs, body ->
        def entityType = attrs.entityType
        def bits = entityType.tokenize(".")
        //log.debug "entityType = $entityType || bits = $bits"
        def controllerName

        if (bits.size() > 2) {
            controllerName = bits[-1].toLowerCase()
        }
        out << controllerName?:entityType
    }

    /**
     * Generate query string from params map, with optional requiredParams (comma separated)
     * list of params to include and optional excludeParam param string to remove/exclude from
     * the query string.
     *
     * @attr params REQUIRED
     * @attr requiredParams
     * @attr excludeParam
     */
    def formatParams = { attrs, body ->
        def outputParams = new GrailsParameterMap([:], request)
        def params = attrs.params
        def requiredList = attrs.requiredParams?.tokenize(",").collect { it.toLowerCase().trim() }

        params.each { k,v ->
            def vL = [v].flatten().findAll { it != null } // String[] and String both converted to List
            def includeThis = false

            // check if param name is needed
            if (!(requiredList && !requiredList.contains(k))) {
                includeThis = true
            }

            // check against the excludeParams
            def vL2 = vL.findAll { it ->
                it != attrs.excludeParam
            }

            log.debug "$k - includeThis = $includeThis || vL2 = $vL2"

            if (includeThis && vL2) {
                outputParams.put(k, vL2)
            }
        }

        out << commonService.buildUrlParamsFromMap(outputParams)
    }

    /**
     * Output appropriate class names for CSS display of sorted column and sort direction
     *
     * @attr params REQUIRED
     * @attr field REQUIRED
     */
    def getSortCssClasses = { attrs, body ->
        def params = attrs.params
        def thisField = attrs.field
        def output = "header"

        if (thisField == params.sort) {
            if (params.order == "DESC") {
                output += " headerSortUp"
            } else {
                output += " headerSortDown"
            }
        }

        out << output
    }

    def currentUserDisplayName = { attrs, body ->
        def mb = new MarkupBuilder(out)
        mb.span(class:'username') {
            mkp.yield(userService.currentUserDisplayName)
        }
    }

    /**
     * FC version of loginlogout taglib from ala-web-theme. Adds icon and button to link
     *
     * @attr logoutUrl
     * @attr loginReturnToUrl
     * @attr logoutReturnToUrl
     * @attr casLoginUrl
     * @attr casLogoutUrl
     * @attr cssClass
     */
    def loginLogoutButton = { attrs, body ->
        def serverUrl = grailsApplication.config.grails.serverURL
        def requestUri = removeContext(serverUrl) + request.forwardURI
        def logoutUrl = attrs.logoutUrl ?: serverUrl + "/session/logout"
        def loginReturnToUrl = attrs.loginReturnToUrl ?: requestUri
        def logoutReturnToUrl = attrs.logoutReturnToUrl ?: requestUri
        def casLoginUrl = attrs.casLoginUrl ?: grailsApplication.config.security.cas.loginUrl ?: "https://auth.ala.org.au/cas/login"
        def casLogoutUrl = attrs.casLogoutUrl ?: grailsApplication.config.security.cas.logoutUrl ?: "https://auth.ala.org.au/cas/logout"
        def output

        if ((attrs.ignoreCookie != "true" &&
                AuthenticationCookieUtils.cookieExists(request, AuthenticationCookieUtils.ALA_AUTH_COOKIE)) ||
                request.userPrincipal) {
            output = "<a href='${logoutUrl}" +
                    "?casUrl=${casLogoutUrl}" +
                    "&appUrl=${logoutReturnToUrl}' " +
                    "class='${attrs.cssClass?:"btn"}'><i class='icon-off'></i> Logout</a>"
        } else {
            // currently logged out
            output =  "<a href='${casLoginUrl}?service=${loginReturnToUrl}' class='${attrs.cssClass}'><span><i class='icon-off'></i> Log in</span></a>"
        }
        out << output
    }

    def userIsLoggedIn = { attr ->
        if (AuthenticationCookieUtils.cookieExists(request, AuthenticationCookieUtils.ALA_AUTH_COOKIE)) {
            out << true
        }
    }

    /**
     * Remove the context path and params from the url.
     * @param urlString
     * @return
     */
    private String removeContext(urlString) {
        def url = urlString.toURL()
        def protocol = url.protocol != -1 ? url.protocol + "://" : ""
        def port = url.port != -1 ? ":" + url.port : ""
        return protocol + url.host + port
    }

    def toSingleWord = { attrs, body ->
        def name = attrs.name ?: body()
        out << name.replaceAll(' ','_')
    }
}
