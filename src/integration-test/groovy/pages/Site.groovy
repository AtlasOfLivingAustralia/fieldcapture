package pages

import geb.Module

/**
 * Models the create/edit site page section.
 */
class Site extends Module {

    static content = {
        extentType { $('#extentSource') }
    }

}
