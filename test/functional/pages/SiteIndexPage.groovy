package pages

import geb.Page

class SiteIndexPage  extends Page{
    static url = 'site/index'

    static at = { title.endsWith('Field Capture')}

    static content = {
        name {$(".siteName")}
    }
}
