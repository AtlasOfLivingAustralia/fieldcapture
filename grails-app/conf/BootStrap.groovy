import au.org.ala.merit.SessionLogger
import grails.converters.JSON
import net.sf.json.JSONNull

class BootStrap {

    def init = { servletContext ->

        JSON.createNamedConfig("nullSafe", { cfg ->
            cfg.registerObjectMarshaller(JSONNull, {return ""})
        })

        servletContext.addListener(SessionLogger)

    }
    def destroy = {
    }


}
