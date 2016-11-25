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
    def pluginLocation = props.getProperty("fieldcapture-hubs-plugin.location") ?: '../fieldcapture-hubs/fieldcapture-hubs-plugin'
    grails.plugin.location.'fieldcapture-plugin' = pluginLocation

    def testPluginLocation = props.getProperty("fieldcapture-test-plugin.location") ?: '../fieldcapture-test-plugin'
    grails.plugin.location.'fieldcapture-test' = testPluginLocation

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

    dependencies {
        compile "com.openhtmltopdf:openhtmltopdf-core:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-pdfbox:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-jsoup-dom-converter:${openhtmltopdfversion}"
        compile "com.openhtmltopdf:openhtmltopdf-log4j:${openhtmltopdfversion}"
    }

    plugins {
        // The plugins are mostly defined in the fieldcapture-hubs-plugin

        runtime ":ala-ws-security:1.5-SNAPSHOT"

        build ":tomcat:7.0.55"

        runtime ":jquery:1.11.1" // Override jquery as 1.8.3 was being pulled in from somewhere
        compile ":resources:1.2.14"

        runtime ":lesscss-resources:1.3.3"

        build ":release:3.0.1"


        //test ":karma-test-runner:0.2.4"

        if (Environment.current != Environment.DEVELOPMENT) {
            compile ":fieldcapture-plugin:1.9-SNAPSHOT"
            test ":fieldcapture-test:0.1-SNAPSHOT"
        }

    }
}
