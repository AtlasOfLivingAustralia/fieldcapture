package au.org.ala.merit

import grails.converters.JSON

class AjaxController {

    /**
     * Simple action that can be called by long running pages periodically to keep the container session alive.
     */
    def keepSessionAlive() {
        render(['status':'ok'] as JSON)
    }

}
