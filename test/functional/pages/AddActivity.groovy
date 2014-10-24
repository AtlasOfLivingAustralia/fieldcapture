package pages

import geb.Page
import geb.navigator.Navigator
import org.openqa.selenium.Keys

/**
 * Models the new activity page.
 */
class AddActivityPage extends Page {
    static url = "activity/create"

    static at = { title == "Create | Activity | Field Capture"}

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

    // Pressing submit actually does an ajax call then changes the page using JavaScript.
    def submit() {
        submitButton.click()

    }

    def setDate(Navigator dateField, String date) {
        dateField.value(date)
        dateField << Keys.chord(Keys.ENTER) // Dismisses the popup calendar
    }
}
