package pages.modules

import geb.Module

class ChooseShapeMap extends Module {

    static content = {
        chooseShape {$("option")}
    }
}
