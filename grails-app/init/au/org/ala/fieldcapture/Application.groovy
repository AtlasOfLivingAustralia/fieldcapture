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
import org.grails.spring.aop.autoproxy.GroovyAwareInfrastructureAdvisorAutoProxyCreator
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.springframework.aop.config.AopConfigUtils
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean

import java.lang.reflect.Field

@Slf4j
class Application extends GrailsAutoConfiguration {

    /**
     * This static block is to enable the use of the Spring @Cacheable annotation which
     * allows the use of an expression containing the result of a method to determine
     * whether the result should be cached.
     * In grails4, we need the @EnableCaching annotation applied to the class, which
     * doesn't work without the block below.
     *
     * It is essentially the same as the block in GrailsAutoConfiguration except we
     * are adding the GroovyAwareInfrastructureAdvisorAutoProxyCreator class to the list.
     *
     * This can be removed when upgrading to grails 5 as this class has been added as
     * per:
     * https://github.com/grails/grails-core/pull/11523/commits/e00701949a27398581d357fe60594c72f861b55b
     */
    private static final String APC_PRIORITY_LIST_FIELD = "APC_PRIORITY_LIST"
    static {
        try {
            // patch AopConfigUtils if possible
            Field field = AopConfigUtils.class.getDeclaredField(APC_PRIORITY_LIST_FIELD)
            if(field != null) {
                field.setAccessible(true)
                Object obj = field.get(null)
                List<Class<?>> list = (List<Class<?>>) obj
                list.add(GroovyAwareInfrastructureAdvisorAutoProxyCreator.class)
            }
        } catch (Throwable e) {
            // ignore
        }
    }

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