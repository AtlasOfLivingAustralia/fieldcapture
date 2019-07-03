import grails.util.Environment

grails.servlet.version = "2.5" // Change depending on target container compliance (2.5 or 3.0)
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.work.dir = "target/work"
grails.project.target.level = 1.6
grails.project.source.level = 1.6
//grails.project.war.file = "target/${appName}-${appVersion}.war"

grails.project.fork = [
    // configure settings for compilation JVM, note that if you alter the Groovy version forked compilation is required
    //  compile: [maxMemory: 256, minMemory: 64, debug: false, maxPerm: 256, daemon:true],

    // configure settings for the test-app JVM, uses the daemon by default
    test: false, // [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, daemon:true],
    // configure settings for the run-app JVM
    run: false, // [maxMemory: 768, minMemory: 512, debug: true, maxPerm: 256],
    // configure settings for the run-war JVM
    war: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
    // configure settings for the Console UI JVM
    console: false// [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256]
]

// settings for the inline fieldcapture-plugin
if (Environment.current == Environment.DEVELOPMENT) {
    def props = new Properties()
    File propertiesFile = new File('/data/fieldcapture/config/fieldcapture-config.properties')
    if (propertiesFile.exists()) {
        propertiesFile.withInputStream {
            stream -> props.load(stream)
        }
    }
    def pluginLocation = props.getProperty("ecodata-client-plugin.location") ?: '../ecodata-client-plugin'
    grails.plugin.location.'ecodata-client-plugin' = pluginLocation
}


clover {
    on = false // Slows down testing individual classes too much.  Override by passing -clover.on to test-app e.g. grails test-app -clover.on unit:
    reports.dir = "target/clover/report"
    reporttask = { ant, binding, self ->
        ant.mkdir(dir: "${clover.reports.dir}")
        ant.'clover-report' {

            ant.current(outfile: "${clover.reports.dir}") {
                format(type: "html")
                ant.columns {
                    lineCount()
                    complexity()
                    filteredElements(format: "bar")
                    uncoveredElements(format: "raw")
                    totalElements(format: "raw")
                    totalPercentageCovered()
                }
            }
        }
        ant.'clover-check'(target: "21%", haltOnFailure: true) { }

    }
}

def openhtmltopdfversion = '0.0.1-RC4'

grails.project.dependency.resolver = "maven"
grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // specify dependency exclusions here; for example, uncomment this to disable ehcache:
        // excludes 'ehcache'
        excludes 'xercesImpl'
    }
    legacyResolve true // needs to be true for inline plugin whether to do a secondary resolve on plugin installation, not advised and here for backwards compatibility
    log "error" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    checksums true // Whether to verify checksums on resolve

    repositories {
        mavenLocal()
        mavenRepo "http://nexus.ala.org.au/content/groups/public/"
    }

    def geoToolsVersion = "11.1"
    def tomcatVersion = '7.0.55'
    def metadataExtractorVersion = "2.6.2"
    def imgscalrVersion = "4.2"
    def httpmimeVersion = "4.2.1"
    def jtsVersion = "1.8"

    dependencies {
        compile "com.openhtmltopdf:openhtmltopdf-core:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-pdfbox:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-jsoup-dom-converter:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-log4j:${openhtmltopdfversion}"
        compile "org.geotools:gt-geojson:${geoToolsVersion}"
        compile "com.drewnoakes:metadata-extractor:${metadataExtractorVersion}"
        compile "org.imgscalr:imgscalr-lib:${imgscalrVersion}"
        compile "org.apache.httpcomponents:httpmime:${httpmimeVersion}"
        compile "com.vividsolutions:jts:${jtsVersion}"
        compile "org.geotools.xsd:gt-xsd-kml:${geoToolsVersion}"
        compile "joda-time:joda-time:2.3"
        compile "org.codehaus.groovy.modules.http-builder:http-builder:0.7.1"
        compile "org.apache.httpcomponents:httpcore:4.4.1"
        compile "org.apache.httpcomponents:httpclient:4.4.1"
        compile "org.apache.httpcomponents:httpmime:4.4.1"
        compile "org.apache.pdfbox:pdfbox:2.0.4"
        build "com.google.guava:guava:21.0"
        test 'org.openclover:clover:4.3.0'
    }

    plugins {
        // The plugins are mostly defined in the fieldcapture-hubs-plugin

        runtime ":ala-ws-security:1.4"

        build ":tomcat:$tomcatVersion"

        runtime ":jquery:1.11.1" // Override jquery as 1.8.3 was being pulled in from somewhere
        build ":release:3.1.2"

        runtime ":jquery:1.11.1"
        compile ":asset-pipeline:2.14.1"
        // Uncomment these to enable additional asset-pipeline capabilities
        //compile ":sass-asset-pipeline:2.13.1"
        compile ":less-asset-pipeline:2.14.1"
        //compile ":coffee-asset-pipeline:2.13.1"
        //compile ":handlebars-asset-pipeline:2.13.1"

        runtime (":rest:0.8") {
            excludes "httpclient", "httpcore"
        }
        compile ":ala-auth:2.2.0"
        runtime ":csv:0.3.1"
        compile ":markdown:1.1.1"
        compile ':cache:1.1.8'
        compile ":cache-ehcache:1.0.5"

        compile ":google-visualization:1.0.1"
        compile ":mail:1.0.6"
        compile ":excel-export:0.2.0"
        compile ":excel-import:1.0.1"

        compile ':cookie:1.4'

        test 'org.grails.plugins:clover:4.3.0'

        if (Environment.current != Environment.DEVELOPMENT) {
            compile (":ecodata-client-plugin:1.10")
        }

    }
}
