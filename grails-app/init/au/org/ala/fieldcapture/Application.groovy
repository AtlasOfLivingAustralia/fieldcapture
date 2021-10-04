package au.org.ala.fieldcapture

import asset.pipeline.AssetPipelineConfigHolder
import au.org.ala.ecodata.forms.TemplateFileAssetResolver
import au.org.ala.merit.SessionLogger
import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import grails.converters.JSON
import grails.util.BuildSettings
import grails.util.Environment
import groovy.util.logging.Slf4j
import net.sf.json.JSONNull
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean

@Slf4j
class Application extends GrailsAutoConfiguration {

    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

    @Override
    Closure doWithSpring() {
        return {
            log.info("doWithSpring....")
            sessionLogger(new ServletListenerRegistrationBean(new SessionLogger()))
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
}