package pages

import geb.Page
import pages.modules.StaticContent

class ContactsPage extends Page {
    static url = '/home/contacts'
    static at = { title == "Contacts | MERIT" }

    static content = {
        pageContent { $('#wrapper').module(StaticContent) }
    }
}
