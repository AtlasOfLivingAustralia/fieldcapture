package pages

import geb.Page

class ProgramPage extends Page {

    static url = 'program/index'

    static at = { name.text() != null }

    static content = {
        name {$('h2')}
    }

}
