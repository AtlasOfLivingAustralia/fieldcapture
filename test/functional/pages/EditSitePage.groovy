package pages

import geb.Page
import pages.modules.EditSiteContent

class EditSitePage extends Page{
    static url = 'program/edit'

    static at = { title.startsWith('Edit')}

    static content = {
        edit {module EditSiteContent}
    }
}
