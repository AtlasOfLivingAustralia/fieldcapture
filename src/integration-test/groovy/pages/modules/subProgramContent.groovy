package pages.modules

import geb.Module

class subProgramContent extends Module {
    static content = {
        subProgramTitle{$("a#subProgramTitleTab",0)}
        subProgramName{$('a#subProgramName')}
        subProgramDescription{$('p#subProgramDescription')}
    }

}
