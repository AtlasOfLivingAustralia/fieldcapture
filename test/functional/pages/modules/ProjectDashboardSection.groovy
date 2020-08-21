package pages.modules

import geb.Module

class ProjectDashboardSection extends Module {
    static  content = {
        serviceTitle{ $(".serviceTitle") }
        serviceHelpText{ $(".helpText")  }
        progresslabel{ $(".progress-label")}

    }
}
