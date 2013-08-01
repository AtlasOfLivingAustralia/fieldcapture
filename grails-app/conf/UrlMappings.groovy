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
		"/about"(controller: 'home', action: 'about')
    "/myProfile"(controller: 'home', action: 'myProfile')
		"500"(view:'/error')
	}
}
