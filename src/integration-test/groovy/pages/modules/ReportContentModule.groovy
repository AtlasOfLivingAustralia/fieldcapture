package pages.modules


import geb.Module

class ReportContentModule extends Module {

    static content = {
        exampleTextField { $('#koOutput_1 input[data-bind$=example]') }
        example2TextField { $('input[data-bind$=example2]') }
    }

}
