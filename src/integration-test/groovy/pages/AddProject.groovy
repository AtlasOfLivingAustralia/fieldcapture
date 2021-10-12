package pages

import geb.Module
import geb.Page



class ProjectDetailsModule extends Module {
    static content = {
        projectName { $('#name') }
    }
}


class AddProjectPage extends Page {
    static url = "project/create"

    static at = { title == "New | Projects | Field Capture"}

    static content = {
        projectDetails {module ProjectDetailsModule}

        submitButton() {
            $("button", class:"btn-primary")
        }
    }

    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def submit() {
        submitButton.click()

    }
}