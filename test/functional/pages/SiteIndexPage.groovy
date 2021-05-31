package pages

import geb.Page

class SiteIndexPage  extends Page{
    static url = 'site/index'

    static at = { title.startsWith('Site')}

    static content = {
        name {$(".siteName")}
    }
}
