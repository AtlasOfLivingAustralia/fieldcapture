import au.org.ala.merit.SettingService
import org.codehaus.groovy.grails.commons.spring.GrailsWebApplicationContext

class UrlMappings {

    static isHubValid(applicationContext, hub) {
        def settingsService = applicationContext.getBean(SettingService)
        return settingsService.isValidHub(hub)
    }

    static mappings = { GrailsWebApplicationContext applicationContext ->
		"/$hub/$controller/$action?/$id?"{
			constraints {
				hub validator: {val, obj -> isHubValid(applicationContext, val)}
			}
		}

        "/$controller/$action?/$id?"{

        }

        "/$hub/$controller/$id?"(parseRequest:true) {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
            action = [GET: "get", POST: "upload", PUT: "upload", DELETE: "delete"]
        }

        "/$controller/$id?"(parseRequest:true) {

            action = [GET: "get", POST: "upload", PUT: "upload", DELETE: "delete"]
        }

        "/$hub/"(controller: 'home', action: 'index') {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
        "/$hub"(controller: 'home', action: 'index') {

            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
        "/"(controller: 'home', action: 'index') {

        }
        "/$hub/nocas/geoService"(controller: 'home', action: 'geoService') {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
        "/nocas/geoService"(controller: 'home', action: 'geoService') {

        }
        "/$hub/myProjects"(controller: 'home', action: 'myProfile') {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
        "/myProjects"(controller: 'home', action: 'myProfile') {

        }

        "/$hub/admin/user/$id"(controller: "user", action: "show") {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
        "/admin/user/$id"(controller: "user", action: "show") {

        }
        "/activity/ajaxUnlock/$userId/$id" {
            controller = 'activity'
            action = 'ajaxUnlock'
        }
        "500"(controller:'error', action:'response500')
        "404"(controller:'error', action:'response404')
        "/$hub?/$controller/ws/$action/$id" {
            constraints {
                hub validator: {val, obj -> isHubValid(applicationContext, val)}
            }
        }
    }
}
