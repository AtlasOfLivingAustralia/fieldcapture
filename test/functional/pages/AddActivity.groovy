package pages

import geb.Module
import geb.Page
import geb.navigator.Navigator
import org.openqa.selenium.Keys


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
    static url = "activity/create"

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
    }

    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def submit() {
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

        submitButton() {
            $("button", class:"btn-primary")
        }
    }


}
