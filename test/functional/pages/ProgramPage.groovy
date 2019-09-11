package pages

import geb.Page

class ProgramPage extends Page {

    static url = 'program/index'

    static at = { waitFor {name.text() != null } }

    static content = {
        name {$('h2')}
        description {$('span[data-bind*=description]')}
    }

}
