package pages

import geb.Page

class AddSubProgram extends Page{
    static url = 'program/create'

    static at = { title.startsWith("Add | Sub Program | MERIT") }

    static content = {
        program { module AddOrEditProgram }
    }
}
