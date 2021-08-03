import grails.util.Environment

/******************************************************************************\
 *  CONFIG MANAGEMENT
 \******************************************************************************/
def appName = 'fieldcapture'
def ENV_NAME = "${appName.toUpperCase()}_CONFIG"
default_config = "/data/${appName}/config/${appName}-config.properties"
if(!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}

// add ala  conf (needed for version >= 0.1.10)
grails.config.locations.add("classpath:ala-config.groovy")

if(System.getenv(ENV_NAME) && new File(System.getenv(ENV_NAME)).exists()) {
    println "[${appName}] Including configuration file specified in environment: " + System.getenv(ENV_NAME);
    grails.config.locations.add "file:" + System.getenv(ENV_NAME)
} else if(System.getProperty(ENV_NAME) && new File(System.getProperty(ENV_NAME)).exists()) {
    println "[${appName}] Including configuration file specified on command line: " + System.getProperty(ENV_NAME);
    grails.config.locations.add "file:" + System.getProperty(ENV_NAME)
} else if(new File(default_config).exists()) {
    println "[${appName}] Including default configuration file: " + default_config;
    grails.config.locations.add "file:" + default_config
} else {
    println "[${appName}] No external configuration file defined."
}

// The grails mail plugin needs configuration in groovy slurper format to specify java mail properties
def mail_config = "/data/${appName}/config/mail-config.groovy"
if (new File(mail_config).exists()) {
    grails.config.locations.add "file:" + mail_config
}


println "[${appName}] (*) grails.config.locations = ${grails.config.locations}"

/******************************************************************************\
 *  RELOADABLE CONFIG
 \******************************************************************************/
reloadable.cfgs = ["file:/data/${appName}/config/${appName}-config.properties"]

grails.project.groupId = "au.org.ala" // change this to alter the default package name and Maven publishing destination
grails.mime.file.extensions = true // enables the parsing of file extensions from URLs into the request format
grails.mime.use.accept.header = false
grails.mime.types = [
        all:           '*/*',
        atom:          'application/atom+xml',
        css:           'text/css',
        csv:           'text/csv',
        form:          'application/x-www-form-urlencoded',
        html:          ['text/html','application/xhtml+xml'],
        js:            'text/javascript',
        json:          ['application/json', 'text/json'],
        multipartForm: 'multipart/form-data',
        rss:           'application/rss+xml',
        text:          'text/plain',
        xml:           ['text/xml', 'application/xml']
]

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000
grails.assets.excludes = ["bootstrap/less/**"]
grails.assets.minifyOptions.excludes = ["**/*.min.js"]

// The default codec used to encode data with ${}
grails.views.default.codec = "none" // none, html, base64
grails.views.gsp.encoding = "UTF-8"
grails.converters.encoding = "UTF-8"
// enable Sitemesh preprocessing of GSP pages
grails.views.gsp.sitemesh.preprocess = true
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart=false

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']

// configure auto-caching of queries by default (if false you can cache individual queries with 'cache: true')
grails.hibernate.cache.queries = false

// revert to grails 2.2 behaviour for html escaping until such time as every page can be reviewed.
grails.views.default.codec = "none"

/******************************************************************************\
 *  EXTERNAL SERVERS
 \******************************************************************************/
if (!biocache.baseURL) {
    biocache.baseURL = "https://biocache.ala.org.au/"
}
if (!ala.baseURL) {
    ala.baseURL = "https://www.ala.org.au"
}
if (!collectory.baseURL) {
    collectory.baseURL = "http://collections-dev.ala.org.au/"
}
if (!headerAndFooter.baseURL) {
    headerAndFooter.baseURL = "http://www2.ala.org.au/commonui"
}
// spatial services
if(!spatial.baseUrl){
    spatial.baseUrl = "https://spatial-test.ala.org.au"
}
if(!spatial.layersUrl){
    spatial.layersUrl = spatial.baseUrl + "/ws"
}
if(!spatial.geoserverUrl){
    spatial.geoserverUrl = spatial.baseUrl + "/geoserver"
}
if (!spatial.wms.url) {
    spatial.wms.url = spatial.baseUrl + "/geoserver/ALA/wms?"
}
if (!spatial.wms.cache.url) {
    spatial.wms.cache.url = spatial.baseUrl + "/geoserver/gwc/service/wms?"
}
if (!spatial.intersectUrl) {
    spatial.intersectUrl = spatial.layersUrl + '/intersect/'
}
if (!sld.polgon.default.url) {
    sld.polgon.default.url = "http://fish.ala.org.au/data/alt-dist.sld"
}
if (!sld.polgon.highlight.url) {
    sld.polgon.highlight.url = "http://fish.ala.org.au/data/fc-highlight.sld"
}
if (!lists.baseURL) {
    lists.baseURL = "https://lists.ala.org.au"
}
if (!bie.baseURL) {
    bie.baseURL = "https://bie.ala.org.au"
}
if (!regions.baseURL) {
    regions.baseURL = 'http://regions.ala.org.au/regions/'
}
if (!regions.otherRegionsURL) {
    regions.otherRegionsURL = regions.baseURL + 'regionList?type=other'
}
if(!webservice.connectTimeout){
    webservice.connectTimeout = 10000
}
if(!webservice.readTimeout){
    webservice.readTimeout = 20000
}
if(!security.cas.logoutUrl){
    security.cas.logoutUrl = 'https://auth.ala.org.au/cas/logout'
}
if(!security.cas.casServerUrlPrefix){
    security.cas.casServerUrlPrefix = 'https://auth.ala.org.au/cas'
}
if(!security.cas.bypass){
    security.cas.bypass = false
}
if(!security.cas.alaAdminRole){
    security.cas.alaAdminRole = "ROLE_ADMIN"
}
if(!security.cas.officerRole){
    security.cas.officerRole = "ROLE_FC_OFFICER"
}
if(!security.cas.adminRole){
    security.cas.adminRole = "ROLE_FC_ADMIN"
}
if (!serverName.case.readOnlyOfficerRole) {
    security.cas.readOnlyOfficerRole = "ROLE_FC_READ_ONLY"
}
if(!upload.images.path){
    upload.images.path = "/data/${appName}/images/"
}
if(!app.http.header.userId){
    app.http.header.userId = "X-ALA-userId"
}

ecodata.baseUrl = "https://ecodata-test.ala.org.au/ws/"
// This is for biocollect/ecodata-client-plugin compatibility
ecodata.service.url = "https://ecodata-test.ala.org.au/ws"

if (!ala.image.service.url) {
    ala.image.service.url = "http://images-dev.ala.org.au/"
}
if(!upload.images.url){
    upload.images.url = "http://fieldcapture.ala.org.au/images/"
}
if(!upload.extensions.blacklist){
    upload.extensions.blacklist = ['exe','js','php','asp','aspx','com','bat']
}
if(!google.maps.url){
    google.maps.url = "https://maps.googleapis.com/maps/api/js?language=en"
}
if(!google.geocode.url){
    google.geocode.url = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&latlng="
}
if(!google.drawmaps.url){
    google.drawmaps.url = "https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry"
}
if (!user.registration.url) {
    user.registration.url = 'https://auth.ala.org.au/userdetails/registration/createAccount'
}
// If true, no-cache headers will be added to all responses.
if(!app.view.nocache){
    app.view.nocache = false
}
if(!merit.support.email) {
    merit.support.email = 'MERIT@environment.gov.au'
}
if (!fieldcapture.system.email.address) {
    fieldcapture.system.email.address = 'merit@ala.org.au'
}
if(!app.default.hub) {
    app.default.hub = 'merit'
}
if (!pdfgen.baseURL){
    pdfgen.baseURL="http://pdfgen.ala.org.au/"
}
if (!userDetailsById.path) {
    userDetailsById.path = "getUserDetails"
}
abn.abnLookupToken = "Insert abn Token here"
abn.abnUrl= "https://abr.business.gov.au/json/AbnDetails.aspx?abn="

esp.activities.admin = 'ESP Annual Report Submission'
reports.filterableActivityTypes = ['RLP Output Report', 'Wildlife Recovery Progress Report - WRR']

risks.scheduleCheckingPeriod = 7

grails {
    cache {
        ehcache {
            ehcacheXmlLocation = 'classpath:merit-ehcache.xml'
            lockTimeout = 1000
        }
    }
}

security {
    cas {
        appServerName = 'http://devt.ala.org.au:8087' // or similar, up to the request path part
        // service = 'http://devt.ala.org.au:8080' // optional, if set it will always be used as the return path from CAS
        casServerUrlPrefix = 'https://auth.ala.org.au/cas'
        loginUrl = 'https://auth.ala.org.au/cas/login'
        logoutUrl = 'https://auth.ala.org.au/cas/logout'
        casServerName = 'https://auth.ala.org.au'
        uriFilterPattern = ['/home/login', '/ajax/keepSessionAlive']
        authenticateOnlyIfCookieFilterPattern = ['/', '/*']
        uriExclusionFilterPattern = ['/assets/.*','/images/.*','/css/.*','/js/.*','/less/.*', '/project/viewReportCallback.*', '/program/viewReportCallback.*', '/rlp/viewReportCallback.*', '/managementUnit/viewReportCallback.*']
    }
}
pdfbox.fontcache="/data/${appName}/cache/"

// Markdown configuration to match behaviour of the JavaScript editor.
markdown.hardwraps = true

environments {
    development {
        grails.logging.jul.usebridge = true
        server.port = 8087
        grails.host = "http://devt.ala.org.au"
        serverName = "${grails.host}:${server.port}"
        grails.serverURL = serverName
        layout.skin = "nrm"
        security.cas.appServerName = serverName
        security.cas.contextPath =
        ecodata.baseUrl = 'http://devt.ala.org.au:8080/ws/'
        upload.images.url = grails.serverURL+'/image/'
        emailFilter = /[A-Z0-9._%-]+@csiro\.au|chris\.godwin\.ala@gmail.com/
        logging.dir = '.'
        ecodata.service.url = 'http://devt.ala.org.au:8080/ws'
        espSupportEmail='ESPmonitoring@environment.gov.au'
    }
    test {
        server.port = "8087"
        grails.host = "http://devt.ala.org.au"
        serverName = "${grails.host}:${server.port}"
        grails.serverURL = serverName
        layout.skin = "nrm"
        app.default.hub='merit'
        runWithNoExternalConfig = true
        wiremock.port = 8018
        def casBaseUrl = "http://devt.ala.org.au:${wiremock.port}"

        security.cas.appServerName=serverName
        security.cas.contextPath=
        security.cas.casServerName="${casBaseUrl}"
        security.cas.casServerUrlPrefix="${casBaseUrl}/cas"
        security.cas.loginUrl="${security.cas.casServerUrlPrefix}/login"
        security.cas.casLoginUrl="${security.cas.casServerUrlPrefix}/login"
        userDetails.url = "${casBaseUrl}/userdetails/userDetails/"
        userDetailsSingleUrl = "${userDetails.Url}getUserDetails"
        userDetailsUrl = "${userDetatails.url}getUserListFull"
        logging.dir = '.'
        upload.images.path = '/tmp'
        upload.images.url = grails.serverURL+'/image/'
        ecodata.baseUrl = 'http://devt.ala.org.au:8080/ws/'
        ecodata.service.url = 'http://devt.ala.org.au:8080/ws'
        pdfgen.baseURL = "http://devt.ala.org.au:${wiremock.port}/"
        abn.abnUrl= "http://localhost:${wiremock.port}/json/AbnDetails.aspx?abn="
        abn.abnLookupToken = "123456"
        api_key='testapikey'
        grails.cache.config = {
            diskStore {
                path '/tmp'
            }
            defaultCache {
                overflowToDisk false
            }
        }
        spatial.baseUrl = "http://localhost:${wiremock.port}"
        spatial.layersUrl = spatial.baseUrl + "/ws"
        reports.filterableActivityTypes = ['RLP Output Report', 'Wildlife Recovery Progress Report - WRR', 'Progress Report']
        grails.mail.port = 3025 // com.icegreen.greenmail.util.ServerSetupTest.SMTP.port
    }
    production {
        grails.logging.jul.usebridge = false
        grails.resources.work.dir = "/data/${appName}/cache"
    }
}
