package au.org.ala.fieldcapture

import au.org.ala.cas.util.AuthenticationCookieUtils
import grails.util.Environment
import groovy.xml.MarkupBuilder
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap


import static org.github.bootstrap.Attribute.outputAttributes

class FCTagLib {

    static namespace = "fc"

    def commonService
    def userService
    def settingService

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

    /**
     * @attr outerClass
     * @attr id
     * @attr name
     * @attr rows
     * @attr printable
     */
    def textArea = { attrs ->
        def outerClass = attrs.remove 'outerClass'
        def isprint = attrs.printable
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
     *
     */
    def select ={ attrs ->
        def isprint = attrs.printable
        def mb = new MarkupBuilder(out)

        if (!isprint) {
            mb.select(attrs) {
                mkp.yieldUnescaped("&nbsp;")
            }
        } else {
            mb.span(class:'span12 printed-form-field') {
                mkp.yieldUnescaped("&nbsp;")
            }
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

        if (!attrs.printable) {
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

            mb.span(class:'add-on open-datepicker') {
                mb.i(class:'icon-th') {
                    mkp.yieldUnescaped("&nbsp;")
                }
            }
        } else {
            def inputAttrs = [
                name:"${attrs.name}",
                id:"${attrs.id ?: attrs.name}",
                class: (attrs.size ?: 'span6') + ' printed-form-field'
            ]

            def ignoreList = ['name', 'id']
            attrs.each {
                if (!ignoreList.contains(it.key)) {
                    inputAttrs[it.key] = it.value
                }
            }
            mb.span(inputAttrs) {
                mkp.yieldUnescaped("&nbsp;")
            }
        }
    }

    /**
     * @attr title
     * @attr printable Is this being printed?
     * body content should contain the help text
     */
    def iconHelp = { attrs, body ->
        if (!attrs.printable) {
            def mb = new MarkupBuilder(out)
            mb.a(href:'#', class:'helphover', 'data-original-title':attrs.title, 'data-content':body()) {
                i(class:'icon-question-sign') {
                    mkp.yieldUnescaped("&nbsp;")
                }
            }
        }
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

        mb.ul(class:'nav hidden-tablet') {
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
// The dashboard mockup is being been hidden - will restore when it is implemented correctly.
//            li(class:attrs.active == 'dashboard' ? 'active' : '') {
//                a(href:createLink(controller: 'report', action:'dashboard')) {
//                    i(class:"icon-signal") {
//                        mkp.yieldUnescaped("&nbsp;")
//                    }
//                    mkp.yieldUnescaped("&nbsp")
//                    mkp.yield(message(code:'default.about.label', default: 'Dashboard'))
//                }
//            }
            Environment.executeForCurrentEnvironment {
              development {
                li(class:attrs.active == 'advanced' ? 'active' : '') {
                    a(href:createLink(controller: 'home', action:'advanced')) {
                        i(class:"icon-th") {
                            mkp.yieldUnescaped("&nbsp;")
                        }
                        mkp.yieldUnescaped("&nbsp")
                        mkp.yield(message(code:'default.advanced.label', default: 'Advanced view'))
                    }
                }
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
        def cssClass = attrs.cssClass?:"btn btn-small btn-inverse btn-login"
        def output

        if ((attrs.ignoreCookie != "true" &&
                AuthenticationCookieUtils.cookieExists(request, AuthenticationCookieUtils.ALA_AUTH_COOKIE)) ||
                request.userPrincipal) {
            output = "<a href='${logoutUrl}" +
                    "?casUrl=${casLogoutUrl}" +
                    "&appUrl=${logoutReturnToUrl}' " +
                    "class='${cssClass}'><i class='icon-off ${(cssClass.contains("btn-login")) ? "icon-white" : ""}'></i> Logout</a>"
        } else {
            // currently logged out
            output =  "<a href='${casLoginUrl}?service=${loginReturnToUrl}' class='${cssClass}'><span><i class='icon-off ${(cssClass.contains("btn-login")) ? "icon-white" : ""}'></i> Log in</span></a>"
        }
        out << output
    }

    def userIsLoggedIn = { attr ->
        if (AuthenticationCookieUtils.cookieExists(request, AuthenticationCookieUtils.ALA_AUTH_COOKIE)) {
            out << true
        }
    }

    /**
     * Check if the logged in user has the requested role
     *
     * @attr role REQUIRED
     */
    def userInRole = { attrs ->
        if (userService.userInRole(attrs.role)) {
            out << true
        }
    }

    /**
     * Build HTML for drop down menu "My projects"
     */
    def userProjectList = { attrs ->
        def user = userService.user
        def maxItems = 10 // total for both list combined
        def mb = new MarkupBuilder(out)
        // common code as closures
        def maxItemsLink = {
            mb.p {
                a(href: g.createLink(controller: "user"), "[showing top ${maxItems} - see full list]")
            }
        }
        def listItem = { p ->
            mb.li {
                span {
                    a(href: g.createLink(controller: 'project', id: p.projectId), p.name)
                }
            }
        }

        if (user) {
            def j = 0 // keeps track of item count for both lists
            // Active projects
            def memberProjects = userService.getProjectsForUserId(user.userId)
            mb.div(class:'listHeading') { mkp.yield("Active projects") }
            mb.ul {
                memberProjects.eachWithIndex { p, i ->
                    if (j < maxItems) {
                        listItem(p.project)
                        j++
                    }
                }?:mkp.yield("[No active projects]")
            }
            if (memberProjects.size() >= maxItems) {
                maxItemsLink()
                return // don't show starred projects as we've exceeded limit
            }
            // Starred projects
            def starredProjects = userService.getStarredProjectsForUserId(user.userId)
            mb.div(class:'listHeading') { mkp.yield("Favourite projects") }
            mb.ul {
                starredProjects.eachWithIndex { p, i ->
                    if (j < maxItems) {
                        listItem(p)
                        j++
                    }
                }?:mkp.yield("[No starred projects]")
            }
            //if (j == maxItems) {
            if (memberProjects.size() + starredProjects.size() > maxItems) {
                maxItemsLink()
            }
        } else {
            mb.div { mkp.yield("Error: User not found") }
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


    def renderJsonObject = { attrs ->
        def object = attrs.object as JSONObject
        if (object) {
            def mb = new MarkupBuilder(out)
            renderObject(object, mb)
        }
    }

    def footerContent = { attrs ->
        def content = settingService.pageFooterText as String
        if (content) {
            out << content.markdownToHtml()
        }
    }

    private void renderObject(Object object, MarkupBuilder mb) {

        if (object instanceof JSONObject) {
            mb.ul() {
                object.keys().each { key ->
                    def value = object.get(key)
                    mb.li() {
                        mkp.yield("${key}")
                        renderObject(value, mb)
                    }
                }
            }
        } else if (object instanceof JSONArray) {
            mb.ul() {
                def arr = object as JSONArray
                arr.eachWithIndex { def entry, int i ->
                    mb.li() {
                        renderObject(entry, mb)
                    }
                }
            }
        } else {
            mb.span() {
                mb.strong() {
                    mkp.yield(object?.toString())
                }
            }

        }
    }


}
