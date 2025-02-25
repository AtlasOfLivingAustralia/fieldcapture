/******************************************************************************\
 *  CONFIG MANAGEMENT
 \******************************************************************************/
def appName = 'fieldcapture'
def ENV_NAME = "${appName.toUpperCase()}_CONFIG"
environments.development.grails.config.locations = ["~/data/${appName}/config/${appName}-config.properties"]
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
grails.views.default.codec = "html"
grails.views.gsp.codecs.expression = "html"
grails.views.gsp.codecs.scriptlets = "html"
grails.views.gsp.codecs.taglib = "none"
grails.views.gsp.codecs.staticparts = "none"
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
grails.plugins.cookie.secure.default = true
grails.plugins.cookie.httpOnly.default = true

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

//this is for SpeciesService class in Merit
if (!bie.service.baseURL) {
    bie.service.baseURL = "https://bie-ws.ala.org.au"
}
//this is for ecodata-client-plugin
bie.baseURL = "https://bie.ala.org.au"

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

if(!security.cas.alaAdminRole){
    security.cas.alaAdminRole = "ROLE_ADMIN"
}
if(!upload.images.path){
    upload.images.path = "/data/${appName}/images/"
}
if(!app.http.header.userId){
    app.http.header.userId = "X-ALA-userId"
}
if (!app.enableALAHarvestSetting) {
    app.enableALAHarvestSetting = false
}
if(!app.domain.whiteList) {
    app.domain.whiteList = "ala.org.au,localhost"
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

abn.abnLookupToken = "Insert abn Token here"
abn.abnUrl= "https://abr.business.gov.au/json/AbnDetails.aspx?abn="
lists.baseURL = "https://lists-ws.test.ala.org.au"
//lists.baseURL = "https://lists-test.ala.org.au/ws"
esp.activities.admin = 'ESP Annual Report Submission'
reports.initialScrollPositionDelay = 1000
risks.scheduleCheckingPeriod = 7
grails.mail.poolSize = 1

grails {
    cache {
        ehcache {
            ehcacheXmlLocation = 'classpath:merit-ehcache.xml'
            lockTimeout = 1000
        }
    }
}
ehcache.directory = '/data/fieldcapture/ehcache'

auth.baseUrl = 'https://auth-test.ala.org.au'
userDetails.web.url = "${auth.baseUrl}/userdetails/"
userDetails.api.url = "${auth.baseUrl}/userdetails/userDetails/"
user.registration.url = "${auth.baseUrl}/userdetails/registration/createAccount"
monitor.core.baseUrl = "https://dev.core-api.monitor.tern.org.au/api"
security {
    cas {
        enabled = false
        appServerName = 'http://localhost:8087' // or similar, up to the request path part
        casServerUrlPrefix = "${auth.baseUrl}/cas"
        loginUrl = "${auth.baseUrl}/cas/login"
        logoutUrl = "${auth.baseUrl}/cas/logout"
        casServerName = "${auth.baseUrl}"
        uriFilterPattern = ['/home/login', '/ajax/keepSessionAlive']
        authenticateOnlyIfCookieFilterPattern = ['/', '/*']
        uriExclusionFilterPattern = ['/assets/.*','/images/.*','/css/.*','/js/.*','/less/.*', '/project/viewReportCallback.*', '/program/viewReportCallback.*', '/rlp/viewReportCallback.*', '/managementUnit/viewReportCallback.*']
    }
    oidc {
        enabled = true
        discoveryUri = "${auth.baseUrl}/cas/oidc/.well-known"
        clientId = "changeMe"
        secret = "changeMe"
        scope = "openid profile email roles user_defined ala"
    }
    jwt {
        enabled = true
        discoveryUrl = "${auth.baseUrl}/cas/oidc/.well-known"
        requiredClaims = ["sub", "iat", "exp", "jti", "client_id"]
    }
}
bdr.api.url="https://changeMe.org.au/api"
bdr.api.readTimeout=60000
bdr['client-id']="changeMe"
bdr['client-secret']="changeMe"
bdr.discoveryUri="https://changeMe.org.au/.well-known"
bdr.jwtScopes="read"
bdr.azure.clientId='changeMe'
bdr.azure.tenantId='changeMe'
bdr.azure.apiScope='api://changeme/.default'
//bdr.dataSet.formats=["application/geo+json","application/rdf+xml", "text/turtle", "application/ld+json", "application/n-triples"]
bdr.dataSet.formats=["application/geo+json", "text/turtle"]

webservice.jwt = true
webservice['jwt-scopes'] = "ala/internal users/read ala/attrs ecodata/read_test ecodata/write_test"
webservice['client-id']='changeMe'
webservice['client-secret'] = 'changeMe'

pdfbox.fontcache="/data/${appName}/cache/"

// Markdown configuration to match behaviour of the JavaScript editor.
markdown.hardwraps = true

sites.known_shapes = [
        [id:'cl11160', name:'NRM (2023)'],
        [id:'cl1048', name:'IBRA 7 Regions'],
        [id:'cl1049', name:'IBRA 7 Subregions'],
        [id:'cl22',name:'Australian states'],
        [id:'cl959', name:'Local Gov. Areas'],
        [id:'cl11194', name:'Australian Marine Parks (2024)']
]

layers.elect = 'cl11163'
layers.states = 'cl927'

environments {
    development {
        grails.logging.jul.usebridge = true
        server.port = 8087
        grails.host = "http://localhost"
        serverName = "${grails.host}:${server.port}"
        grails.serverURL = serverName
        layout.skin = "nrm"
        security.cas.appServerName = serverName
        security.cas.contextPath =
        ecodata.baseUrl = 'http://localhost:8080/ws/'
        upload.images.url = grails.serverURL+'/image/'
        upload.images.path = "${System.getProperty('user.home')}/data/${appName}/images/"
        emailFilter = /[A-z0-9._%-]+@csiro\.au|chris\.godwin\.ala@gmail.com|[A-z0-9._%-]+@dcceew\.gov\.au/
        logging.dir = '.'
        ecodata.service.url = 'http://localhost:8080/ws'
        espSupportEmail='ESPmonitoring@environment.gov.au'
        ehcache.directory = './ehcache'
    }
    test {
        server.port = "8087"
        grails.host = "http://localhost"
        serverName = "${grails.host}:${server.port}"
        grails.serverURL = serverName
        layout.skin = "nrm"
        app.default.hub='merit'
        wiremock.port = 8018
        security.oidc.discoveryUri = "http://localhost:${wiremock.port}/cas/oidc/.well-known"
        security.jwt.discoveryUri = "http://localhost:${wiremock.port}/cas/oidc/.well-known"
        bdr.discoveryUri = "http://localhost:${wiremock.port}/cas/oidc/.well-known"
        security.oidc.allowUnsignedIdTokens = true
        security.oidc.clientId="oidcId"
        security.oidc.secret="oidcSecret"
        webservice['client-id']="jwtId"
        webservice['client-secret'] = "jwtSecret"
        tokenURI = "http://localhost:${wiremock.port}/cas/oidc/oidcAccessToken"
        jwkURI = "http://localhost:${wiremock.port}/cas/oidc/jwks"
        issuerURI = "http://localhost:${wiremock.port}/cas/oidc"
        def casBaseUrl = "http://localhost:${wiremock.port}"
        ehcache.directory = './ehcache'
        security.cas.appServerName=serverName
        security.cas.contextPath=
        security.cas.casServerName="${casBaseUrl}"
        security.cas.casServerUrlPrefix="${casBaseUrl}/cas"
        security.cas.loginUrl="${security.cas.casServerUrlPrefix}/login"
        security.cas.casLoginUrl="${security.cas.casServerUrlPrefix}/login"
        security.cas.logoutUrl="${security.cas.casServerUrlPrefix}/logout"
        userDetails.api.url = "${casBaseUrl}/userdetails/userDetails/"
        logging.dir = '.'
        upload.images.path = '/tmp'
        upload.images.url = grails.serverURL+'/image/'
        ecodata.baseUrl = 'http://localhost:8080/ws/'
        ecodata.service.url = 'http://localhost:8080/ws'
        pdfgen.baseURL = "http://localhost:${wiremock.port}/"
        lists.baseURL = "http://localhost:${wiremock.port}"
        abn.abnUrl= "http://localhost:${wiremock.port}/json/AbnDetails.aspx?abn="
        abn.abnLookupToken = "123456"
        api_key='testapikey'
        spatial.baseUrl = "http://localhost:${wiremock.port}"
        spatial.layersUrl = spatial.baseUrl + "/ws"
        grails.mail.port = 3025 // com.icegreen.greenmail.util.ServerSetupTest.SMTP.port

    }
    production {
        grails.logging.jul.usebridge = false
        grails.resources.work.dir = "/data/${appName}/cache"
        server.servlet.session.cookie.secure = true
    }
}
