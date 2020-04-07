package pages.modules

import geb.Module

class subProgramContent extends Module {
    static content = {
        subProgramName(required:false){$('a#subProgramName')}
        subProgramDescription(required:false){$('p#subProgramDescription')}
    }

}
