class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"(controller: 'home', action: 'index')
		"/about"(controller: 'home', action: 'about')
		"500"(view:'/error')
	}
}
