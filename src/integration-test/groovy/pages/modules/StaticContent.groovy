package pages.modules

import geb.Module

class StaticContent extends Module {

    static content = {
        editButton(required:false) { $('a[href*=editSettingText]') }

        heading { $('h1') }
        staticContent { $('#aboutDescription') }
    }
}
