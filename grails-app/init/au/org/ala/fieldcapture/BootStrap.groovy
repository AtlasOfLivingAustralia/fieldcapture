package au.org.ala.fieldcapture

import au.org.ala.ecodata.forms.TemplateFileAssetResolver
import au.org.ala.merit.SessionLogger
import au.org.ala.merit.SettingService
import grails.converters.JSON
import grails.util.Environment
import net.sf.json.JSONNull
import grails.core.GrailsApplication
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import grails.util.BuildSettings
import asset.pipeline.AssetPipelineConfigHolder

class BootStrap {

    SettingService settingService
    GrailsApplication grailsApplication

    def init = { servletContext ->

        JSON.createNamedConfig("nullSafe", { cfg ->
            cfg.registerObjectMarshaller(JSONNull, {return ""})
        })

        JSON.createNamedConfig("clientSideFormattedDates", { cfg ->
            DateTimeFormatter formatter = DateTimeFormat.forPattern("dd-MM-yyyy")
            cfg.registerObjectMarshaller(LocalDate.class, { formatter.print(it) })
        })

        if (Environment.current != Environment.TEST) {
            //servletContext.addListener(SessionLogger)
        }

        if (Environment.isDevelopmentMode()) {
            String appDir = "${BuildSettings.BASE_DIR?.absolutePath}"
            def templateFileAssetResolver = new TemplateFileAssetResolver('templates', "${appDir}/grails-app/assets/components", false, '/compile/templates.js', '/template')
            AssetPipelineConfigHolder.resolvers.add(0, templateFileAssetResolver)
        }
    }
    def destroy = {
    }


}
