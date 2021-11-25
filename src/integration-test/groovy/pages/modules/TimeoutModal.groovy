package pages.modules

import geb.Module

class TimeoutModal extends Module {
    static content = {
        loginLink { $('div.bootbox.modal a[href*="cas/login"]') }
    }
}
