import au.org.ala.merit.SessionLogger
import au.org.ala.merit.SettingService
import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import groovy.json.JsonSlurper
import net.sf.json.JSONNull
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter

import static au.org.ala.merit.ScheduledJobContext.withUser


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
        servletContext.addListener(SessionLogger)

        withUser([name:"meritBootstrap"]) {
            // Insert the MERIT hub into ecodata if it's not already there
            String meritHubPath = grailsApplication.config.app.default.hub ?: 'merit'
            HubSettings meritHub = settingService.getHubSettings(meritHubPath)
            if (!meritHub) {
                log.info("Creating the MERIT hub")
                Map meritSettings = new JsonSlurper().parse(getClass().getResource('/data/meritHub.json'))
                meritHub = new HubSettings(meritSettings)
                settingService.updateHubSettings(meritHub)
            }
        }

    }
    def destroy = {
    }


}
