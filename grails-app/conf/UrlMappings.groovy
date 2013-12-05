class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

    "/$controller/$id?"(parseRequest:true) {
        action = [GET: "get", POST: "upload", PUT: "upload", DELETE: "delete"]
    }

		"/"(controller: 'home', action: 'index')
	//	"/about"(controller: 'home', action: 'about')
    "/myProfile"(controller: 'home', action: 'myProfile')
    "/user/index"(controller: "user", action: "index")
    "/user/checkEmailExists"(controller: "user", action: "checkEmailExists")
    "/user/removeUserWithRole"(controller: "user", action: "removeUserWithRole")
    "/user/addUserAsRoleToProject"(controller: "user", action: "addUserAsRoleToProject")
    "/admin/user/${id}"(controller: "user", action: "show")
		"500"(view:'/error')
	}
}
