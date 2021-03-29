package pages

import geb.Module
import geb.Page
import geb.navigator.Navigator
import org.openqa.selenium.Keys
import pages.modules.TimeoutModal


class ActivityPage extends Page {


    def setDate(Navigator dateField, String date) {
        dateField.value(date)
        dateField << Keys.chord(Keys.ENTER) // Dismisses the popup calendar
    }
}

/**
 * Models the new activity page.
 */
class AddActivityPage extends ActivityPage {
    static url = "activity/createPlan"

    static at = { title == "Create | Activity | Field Capture"}

    static content = {
        activityDetails { module ActivityDetails }
    }

    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def submit() {
        activityDetails.submitButton.click()
    }
}


class EditActivityPage extends ActivityPage {
    static url = "activity/edit"
    static at = { title =~ /Edit | .* | Field Capture/}

    static content = {
        activityDetails { module ActivityDetails }
        timeoutModal(required: false) { $('div.bootbox.modal').module TimeoutModal }
        unsavedEdits(required: false) { $('div.bootbox') }

    }

    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def submit() {
        waitFor { activityDetails.submitButton.displayed}
        activityDetails.submitButton.click()
    }

}

class ActivityDetails extends Module {
    static content = {
        site { $('[data-bind~=value:siteId]') }
        type { $('#type') }
        theme { $('#theme') }
        description { $('#description') }
        plannedStartDate { $('#plannedStartDate') }
        plannedEndDate { $('#plannedEndDate') }
        submit {$(".form-actions .btn-primary")}
        submitButton() {
            $("button", class:"btn-primary")
        }
    }


}
