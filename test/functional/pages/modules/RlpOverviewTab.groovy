package pages.modules

import geb.Module

class RlpOverviewTab extends Module {
    static content = {
        program { $('div', text:'Program').siblings()[0] }
        managementUnit { $('div', text:'Management Unit').siblings()[0] }
        serviceProvider { $('div', text:'Service Provider').siblings()[0] }
        projectId { $('div', text:'Project ID').siblings()[0] }
        status { $('div', text:'Project status').siblings()[0] }
        projectStart { $('div', text:'Project start').siblings()[0] }
        projectEnd { $('div', text:'Project end').siblings()[0] }
        funding { $('div', text:'Project Funding').siblings()[0] }
        orderNumber { $('div', text:'Internal order number').siblings()[0]}

        description { $('p[data-bind*=description]') }
        newsAndEvents { $('div', text:'').siblings()[0] }
        stories { $('div', text:'').siblings()[0] }

    }

}
