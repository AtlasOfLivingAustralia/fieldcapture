package pages

import geb.Module
import geb.Page
import geb.navigator.Navigator
import org.openqa.selenium.Keys

class CreateProject extends ProjectDetails {

    static url = "project/create"

    static at = { title == "Create | Project | Field Capture" }
}


class EditProject extends ProjectDetails {

    static url = "project/edit"

    static at = { title.endsWith("Projects | Field Capture") }

}

class ProjectDetails extends Page {
    static content = {
        projectType { $('[data-bind*="value:transients.projectKind"]') }
        projectTypeSelectedText {projectType.find('option', value:projectType.value()).text()}
        recordUsingALA { $('[data-bind*="booleanValue:isExternal"]') }
        recordUsingALASelectedText {recordUsingALA.find('option', value:recordUsingALA.value()).text()}
        organisation { module OrganisationSearch }
        name { $('[data-bind*="value:name"]') }
        description { $('[data-bind*="value:description"]') }
        contactEmailAddress { $('') }
        plannedStartDate { $('#plannedStartDate') }
        plannedEndDate { $('#plannedEndDate') }
        getInvolved { $('[data-bind*="value:getInvolved"]') }
        scienceType { $('[data-bind*="value:scienceType"]') }

        site { module Site }
        saveButton { $('#save') }
        cancelButton { $('#cancel') }

    }

    def setDate(Navigator dateField, String date) {
        dateField.value(date)
        dateField << Keys.chord(Keys.ENTER) // Dismisses the popup calendar
    }
    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def save() {
        saveButton.click()
    }
    def cancel() {
        cancelButton.click()
    }
}


class OrganisationSearch extends Module {
    static content = {
        organisationName { $('#organisationName')}
        results { $('#organisation-list a') }
        notOnList { $('[data-bind*="checked:organisationNotPresent"') }
        clearButton {$('[data-bind*="click:clearSelection"')}
        registerButton {$('#registerOrganisation')}
    }
    def clearSelection() {
        clearButton.click()
    }

    def selectOrganisation(name) {
        println $('#organisation-list a', text:name)
        $('#organisation-list a', text:name).click()
    }

}

