package pages

import geb.Page
import pages.modules.StaticContent

class AboutPage extends Page {
    static url = '/home/about'
    static at = { title == "About | MERIT" }

    static content = {
        pageContent { $('#wrapper').module(StaticContent) }
    }
}
