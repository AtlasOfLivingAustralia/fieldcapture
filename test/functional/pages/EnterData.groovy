package pages

import geb.Module
import geb.Page

/**
 * Created by god08d on 28/10/2014.
 */
class EnterData extends Page {

    def model = 'get the model somehow!'
    static content = {


    }

}

class ActivityImplementationDetails extends Module {
    static content = {
        projectName {$('')}
        site {$('')}
        description {$('')}
        progress {$('')}
        plannedStartDate {$('')}
        plannedEndDate {$('')}
        startDate {$('')}
        endDate {$('')}

    }

}


class OutputModule extends Module {


    def model

    static content = {
        title {$('')}




    }

    def setModelValue(name, value) {
        // Find the value in the model.

        // Find the element on the page.


        // Set the value.
        $('[data-bind$='+name+']').value(value)

    }

}
