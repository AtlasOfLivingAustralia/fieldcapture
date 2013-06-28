package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.util.Environment
import org.springframework.core.io.support.PathMatchingResourcePatternResolver

class AdminController {

    def cacheService, metadataService

    def index() {}
    def tools() {}
    def users() {}
    def metadata() {
        [activitiesMetadata: metadataService.activitiesModel()]
    }

    def settings() {
        def settings = [
            [key:'app.external.model.dir', value: grailsApplication.config.app.external.model.dir,
            comment: 'location of the application meta-models such as the list of activities and ' +
                    'the output data models']
        ]
        def config = grailsApplication.config.flatten()
        ['ecodata.baseUrl','grails.serverURL','grails.config.locations','biocache.baseURL',
            'spatial.baseURL','ala.baseURL','collectory.baseURL','headerAndFooter.baseURL',
            'spatial.layers.service.url','sld.polgon.default.url',
            'sld.polgon.highlight.url','spatialLayerServices.baseUrl'
        ].each {
            settings << [key: it, value: config[it], comment: '']
        }
        [settings: settings]
    }

    def reloadConfig = {
        // reload system config
        def resolver = new PathMatchingResourcePatternResolver()
        def resource = resolver.getResource(grailsApplication.config.reloadable.cfgs[0])
        if (!resource) {
            def warning = "No external config to reload. grailsApplication.config.grails.config.locations is empty."
            println warning
            flash.message = warning
            render warning
        } else {
            def stream = null

            try {
                stream = resource.getInputStream()
                ConfigSlurper configSlurper = new ConfigSlurper(Environment.current.name)
                if(resource.filename.endsWith('.groovy')) {
                    def newConfig = configSlurper.parse(stream.text as String)
                    grailsApplication.getConfig().merge(newConfig)
                }
                else if(resource.filename.endsWith('.properties')) {
                    def props = new Properties()
                    props.load(stream)
                    def newConfig = configSlurper.parse(props)
                    grailsApplication.getConfig().merge(newConfig)
                }
                flash.message = "Configuration reloaded."
                String res = "<ul>"
                grailsApplication.config.each { key, value ->
                    if (value instanceof Map) {
                        res += "<p>" + key + "</p>"
                        res += "<ul>"
                        value.each { k1, v1 ->
                            res += "<li>" + k1 + " = " + v1 + "</li>"
                        }
                        res += "</ul>"
                    }
                    else if (key != 'api_key') { // never reveal the api key
                        res += "<li>${key} = ${value}</li>"
                    }
                }
                render res + "</ul>"
            }
            catch (FileNotFoundException fnf) {
                def error = "No external config to reload configuration. Looking for ${grailsApplication.config.grails.config.locations[0]}"
                log.error error
                flash.message = error
                render error
            }
            catch (Exception gre) {
                def error = "Unable to reload configuration. Please correct problem and try again: " + gre.getMessage()
                log.error error
                flash.message = error
                render error
            }
            finally {
                stream?.close()
            }
        }
    }

    def clearMetadataCache() {
        // clear any cached external config
        cacheService.clear()
        flash.message = "Metadata cache cleared."
        render 'done'
    }

    def updateActivitiesModel() {
        def model = request.JSON
        log.debug model
        metadataService.updateActivitiesModel(model.toString())
        def result = model
        render result
    }
}
