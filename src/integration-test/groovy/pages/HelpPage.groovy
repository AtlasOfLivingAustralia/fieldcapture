package pages

import geb.Page
import pages.modules.StaticContent

class HelpPage extends Page {
    static url = '/home/help'
    static at = { title == "Help | MERIT" }

    static content = {
        pageContent { $('#wrapper').module(StaticContent) }
    }
}
