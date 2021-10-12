package pages

import geb.Module
import geb.Page


class MERITAdministrationPage extends Page {
    static url = "admin/index"
    static at = { title.startsWith("Admin | MERIT") }

    static content = {
        administration { module AdminTabContent }
    }
}

class AdminTabContent extends Module {

    static content = {
        adminTab { $("#admin li") }
        audit { $(".audit") }
        staticPages { $(".staticPages") }
        staticPageContent { module StaticContent }
        helpResources { $(".helpResource") }
        siteBlog { $(".siteBlog") }
        homePageImages { $(".homePageImage") }
        administratorReport { $(".adminReport") }
        loadProject { $(".loadProject") }
        removeUser { $(".removeUser") }
        tools { $(".tools") }
        settings { $(".settings") }
        caches { $(".caches") }

    }

}

class StaticContent extends Module {

    static content = {
        pageId { $("table tbody tr") }

    }
}
