import au.org.ala.merit.SessionLogger
import grails.converters.JSON
import net.sf.json.JSONNull
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter


class BootStrap {

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
