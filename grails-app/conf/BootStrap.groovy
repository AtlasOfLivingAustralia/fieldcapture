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

    }
    def destroy = {
    }


}
