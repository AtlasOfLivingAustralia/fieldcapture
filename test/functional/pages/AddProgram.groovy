package pages

import geb.Page

class AddProgram extends Page {

    static url = "program/create"

    static at = { title.startsWith("Create | Program") }

    static content = {
        program { module AddOrEditProgram }
    }

}
