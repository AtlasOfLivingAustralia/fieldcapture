package pages.modules

import geb.Module

class ProjectAccessSection extends Module{
    static content = {
        userId {$(".memUserId")}
        userName{ $(".memUserName")}
        role { $ (".memUserRole")}
    }
}
