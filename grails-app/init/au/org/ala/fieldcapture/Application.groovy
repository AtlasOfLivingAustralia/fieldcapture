package au.org.ala.fieldcapture

import asset.pipeline.AssetPipelineConfigHolder
import au.org.ala.ecodata.forms.TemplateFileAssetResolver
import grails.boot.GrailsApp
import grails.boot.config.GrailsApplicationPostProcessor
import grails.boot.config.GrailsAutoConfiguration
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.util.BuildSettings
import grails.util.Environment
import grails.util.Metadata
import groovy.util.logging.Slf4j
import net.sf.json.JSONNull
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.springframework.context.annotation.Bean

@Slf4j
class Application extends GrailsAutoConfiguration {

    private static final String EHCACHE_DIRECTORY_CONFIG_ITEM = "ehcache.directory"
    private static final String DEFAULT_EHCACHE_DIRECTORY = "./ehcache"

    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

    @Override
    Closure doWithSpring() {

        return {
            log.info("doWithSpring....")
        }
    }

    @Override
    void onStartup(Map<String, Object> event) {
        log.info("On startup...")
        JSON.createNamedConfig("nullSafe", { cfg ->
            cfg.registerObjectMarshaller(JSONNull, {return ""})
        })

        JSON.createNamedConfig("clientSideFormattedDates", { cfg ->
            DateTimeFormatter formatter = DateTimeFormat.forPattern("dd-MM-yyyy")
            cfg.registerObjectMarshaller(LocalDate.class, { formatter.print(it) })
        })

        if (Environment.isDevelopmentMode()) {
            String appDir = "${BuildSettings.BASE_DIR?.absolutePath}"
            def templateFileAssetResolver = new TemplateFileAssetResolver('templates', "${appDir}/grails-app/assets/components", false, '/compile/templates.js', '/template')
            AssetPipelineConfigHolder.resolvers.add(0, templateFileAssetResolver)
        }
    }

    @Override
    void onShutdown(Map<String, Object> event) {
        log.info("Shutting down - destroying the cache manager")
        applicationContext.grailsCacheManager.destroy()
    }

    @Bean
    GrailsApplicationPostProcessor grailsApplicationPostProcessor() {

        // We are overriding the GrailsApplicationPostProcessor because we need a lifecycle hook after
        // the configuration has been read, but before the plugin lifecycle bean initialisation has started.
        // This is because the grails ehcache plugin only supports configuration via XML files and the
        // cache directory store can only be configured via an environment variable.
        // To keep the configuration in one place, we are reading the config, and setting the system property
        // so it can be read during cache initialisation.
        return new GrailsApplicationPostProcessor( this, applicationContext, classes() as Class[]) {
            @Override
            protected void customizeGrailsApplication(GrailsApplication grailsApplication) {
                String applicationName =  Metadata.current.getApplicationName()
                String applicationVersion =  Metadata.current.getApplicationVersion()
                System.setProperty('http.agent', 'au.org.ala.'+applicationName+'/'+applicationVersion)
                System.setProperty(EHCACHE_DIRECTORY_CONFIG_ITEM, grailsApplication.config.getProperty(EHCACHE_DIRECTORY_CONFIG_ITEM, DEFAULT_EHCACHE_DIRECTORY))
            }
        }
    }
}