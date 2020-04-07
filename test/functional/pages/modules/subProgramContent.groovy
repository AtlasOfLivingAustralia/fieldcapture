package pages.modules

import geb.Module

class subProgramContent extends Module {
    static content = {
        subProgramTitle(required: false) {$("a#subProgramTab",0)}
        subProgramName(required:false){$('a#subProgramName')}
        subProgramDescription(required:false){$('p#subProgramDescription')}
    }

}
