package au.org.ala.merit

import au.org.ala.merit.SettingService

class UrlMappings {

    static excludes = ['/plugins']

    static isHubValid(hub) {
        def settingsService = grails.util.Holders.applicationContext.getBean(SettingService)
        return settingsService.isValidHub(hub)
    }

    static mappings = {

		"/$hub/$controller/$action?/$id?"{
			constraints {
				hub validator: {val, obj -> isHubValid(val)}
			}
		}

        "/$controller/$action?/$id?"{

        }

        "/$hub/$controller/$id?"(parseRequest:true) {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
            action = [GET: "get", POST: "upload", PUT: "upload", DELETE: "delete"]
        }

        "/$controller/$id?"(parseRequest:true) {
            action = [GET: "get", POST: "upload", PUT: "upload", DELETE: "delete"]
        }

        "/$hub/"(controller: 'home', action: 'index') {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
        "/$hub"(controller: 'home', action: 'index') {

            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
        "/"(controller: 'home', action: 'index') {

        }
        "/$hub/nocas/geoService"(controller: 'home', action: 'geoService') {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
        "/nocas/geoService"(controller: 'home', action: 'geoService') {

        }
        "/$hub/myProjects"(controller: 'home', action: 'myProfile') {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
        "/myProjects"(controller: 'home', action: 'myProfile') {

        }

        "/$hub/admin/user/$id"(controller: "user", action: "show") {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
        "/admin/user/$id"(controller: "user", action: "show") {

        }
        "/$hub/activity/ajaxUnlock/$userId/$id" {
            controller = 'activity'
            action = 'ajaxUnlock'
        }
        "/activity/ajaxUnlock/$userId/$id" {
            controller = 'activity'
            action = 'ajaxUnlock'
        }

        "/explore/$section/$subsection?" {
            controller = 'home'
            action = 'projectExplorer'
        }

        "/rlp/$action/$id?" {
            controller = 'program'
        }

        "/$hub/rlp/$action/$id?" {
            controller = 'program'
        }

        "500"(view:'/error')
        "404"(view:'/404')
        "/$hub/$controller/ws/$action/$id" {
            constraints {
                hub validator: {val, obj -> isHubValid(val)}
            }
        }
    }
}
