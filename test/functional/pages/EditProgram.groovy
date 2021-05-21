package pages

import geb.Page

class EditProgram extends Page {

    static url = 'program/edit' // requires a program id parameter

    static at = { title.startsWith('Edit')}

    static content = {
        details { module AddOrEditProgram }
    }
}
