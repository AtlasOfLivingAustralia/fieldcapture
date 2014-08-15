/******************************************************************************\
 *  CONFIG MANAGEMENT
 \******************************************************************************/
def appName = 'fieldcapture'
def ENV_NAME = "${appName.toUpperCase()}_CONFIG"
default_config = "/data/${appName}/config/${appName}-config.properties"
if(!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}

// add ala skin conf (needed for version >= 0.1.10)
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

grails.project.groupId = "au.org.ala." + appName // change this to alter the default package name and Maven publishing destination
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

// What URL patterns should be processed by the resources plugin
grails.resources.adhoc.patterns = ['/images/*', '/css/*', '/js/*', '/plugins/*']

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

/******************************************************************************\
 *  EXTERNAL SERVERS
 \******************************************************************************/
if (!biocache.baseURL) {
    biocache.baseURL = "http://biocache.ala.org.au/"
}
if (!ala.baseURL) {
    ala.baseURL = "http://www.ala.org.au"
}
if (!collectory.baseURL) {
    collectory.baseURL = "http://collections.ala.org.au/"
}
if (!headerAndFooter.baseURL) {
    headerAndFooter.baseURL = "http://www2.ala.org.au/commonui"
}
// spatial services
if(!spatial.baseUrl){
    spatial.baseUrl = "http://spatial-dev.ala.org.au"
}
if(!spatial.layersUrl){
    spatial.layersUrl = spatial.baseUrl + "/layers-service"
}
if(!spatial.geoserverUrl){
    spatial.geoserverUrl = spatial.baseUrl + "/geoserver"
}
if (!spatial.wms.url) {
    spatial.wms.url = spatial.baseUrl + "geoserver/ALA/wms?"
}
if (!spatial.wms.cache.url) {
    spatial.wms.cache.url = spatial.baseUrl + "geoserver/gwc/service/wms?"
}
if (!spatial.intersectUrl) {
    spatial.intersectUrl = spatial.baseUrl + '/ws/intersect/'
}
if (!sld.polgon.default.url) {
    sld.polgon.default.url = "http://fish.ala.org.au/data/alt-dist.sld"
}
if (!sld.polgon.highlight.url) {
    sld.polgon.highlight.url = "http://fish.ala.org.au/data/fc-highlight.sld"
}
if (!lists.baseURL) {
    lists.baseURL = "http://lists.ala.org.au"
}
if (!bie.baseURL) {
    bie.baseURL = "http://bie.ala.org.au"
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
if(!ecodata.baseUrl){
    ecodata.baseUrl = "http://ecodata.ala.org.au/ws/"
}
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
    google.maps.url = "//maps.google.com/maps/api/js?sensor=false&language=en"
}
if(!google.geocode.url){
    google.geocode.url = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&latlng="
}
if(!google.drawmaps.url){
    google.drawmaps.url = "//maps.google.com/maps/api/js?sensor=false&libraries=drawing,geometry"
}
// If true, no-cache headers will be added to all responses.
if(!app.view.nocache){
	app.view.nocache = false
}
if(!merit.support.email) {
    merit.support.email = 'MERIT@environment.gov.au'
}

// Markdown configuration to match behaviour of the JavaScript editor.
markdown.hardwraps = true

environments {
    development {
        grails.logging.jul.usebridge = true
        server.port = "8087"
        grails.host = "http://devt.ala.org.au"
        serverName = "${grails.host}:${server.port}"
        grails.serverURL = serverName + "/fieldcapture"
        layout.skin = "nrm"
        security.cas.appServerName = serverName
        security.cas.contextPath = "/" + appName
        ecodata.baseUrl = 'http://devt.ala.org.au:8080/ecodata/ws/'
        //ecodata.baseUrl = 'http://ecodata-test.ala.org.au/ws/'

        upload.images.url = grails.serverURL+'/image/'
        emailFilter = /[A-Z0-9._%-]+@csiro\.au|chris\.godwin\.ala@gmail.com/
        logging.dir = '.'
    }
    production {
        grails.logging.jul.usebridge = false
        grails.resources.work.dir = "/data/${appName}/cache"
    }
}

// log4j configuration
if (!logging.dir) {
    logging.dir = (System.getProperty('catalina.base') ? System.getProperty('catalina.base') + '/logs'  : '/var/log/tomcat6')
}
log4j = {
    appenders {
        environments{
            development {
                console name: "stdout",
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n"),
                        threshold: org.apache.log4j.Level.DEBUG
                rollingFile name: "/fieldcaptureLog",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture.log",
                        threshold: org.apache.log4j.Level.INFO,
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n")
                rollingFile name: "stacktrace",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture-stacktrace.log"
            }
            test {
                rollingFile name: "fieldcaptureLog",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture.log",
                        threshold: org.apache.log4j.Level.INFO,
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n")
                rollingFile name: "stacktrace",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture-stacktrace.log"
            }
            nectar {
                rollingFile name: "fieldcaptureLog",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture.log",
                        threshold: org.apache.log4j.Level.INFO,
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n")
                rollingFile name: "stacktrace",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture-stacktrace.log"
            }
            nectartest {
                rollingFile name: "fieldcaptureLog",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture.log",
                        threshold: org.apache.log4j.Level.INFO,
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n")
                rollingFile name: "stacktrace",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture-stacktrace.log"
            }
            production {
                rollingFile name: "fieldcaptureLog",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture.log",
                        threshold: org.apache.log4j.Level.INFO,
                        layout: pattern(conversionPattern: "%d %-5p [%c{1}]  %m%n")
                rollingFile name: "stacktrace",
                        maxFileSize: 104857600,
                        file: logging.dir+"/fieldcapture-stacktrace.log"
            }
        }
    }

    environments {
        development {
            all additivity: false, stdout: [
                    'grails.app.controllers.au.org.ala.fieldcapture',
                    'grails.app.domain.au.org.ala.fieldcapture',
                    'grails.app.services.au.org.ala.fieldcapture',
                    'grails.app.taglib.au.org.ala.fieldcapture',
                    'grails.app.conf.au.org.ala.fieldcapture',
                    'grails.app.filters.au.org.ala.fieldcapture',
                    'au.org.ala.cas.client'
            ]
        }
    }

    all additivity: false, fieldcaptureLog: [
            'grails.app.controllers.au.org.ala.fieldcapture',
            'grails.app.domain.au.org.ala.fieldcapture',
            'grails.app.services.au.org.ala.fieldcapture',
            'grails.app.taglib.au.org.ala.fieldcapture',
            'grails.app.conf.au.org.ala.fieldcapture',
            'grails.app.filters.au.org.ala.fieldcapture'
    ]

    debug 'grails.app.controllers.au.org.ala','ala','au.org.ala.web' // 'au.org.ala.cas.client',

    error  'org.codehaus.groovy.grails.web.servlet',        // controllers
           'org.codehaus.groovy.grails.web.pages',          // GSP
           'org.codehaus.groovy.grails.web.sitemesh',       // layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping',        // URL mapping
           'org.codehaus.groovy.grails.commons',            // core / classloading
           'org.codehaus.groovy.grails.plugins',            // plugins
           'org.codehaus.groovy.grails.orm.hibernate',      // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'
}
