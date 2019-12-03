package pages

import geb.Page
import pages.modules.ManagementUnitAdminTab


class ManagementUnitPage extends ReloadablePage {

    static url = 'managementUnit/index/test_mu'

    static at = { waitFor {name.text() != null } }

    static content = {
        name {$('div#managementUnitName h2')}
        overviewBtn{$('a#about-tab', 0)}
        grantIdsTable{$('td.grantId')}
        projectLinksTd{$('td.grantId a')}
        gotoProgramLinks{$('a.gotoProgram')}
        blogTab{$('#blog-tab')}
        blogContentDiv {$('div.muBlogContent')}
        blogModule {module BlogPageModule}
        editManagementUnitBlogPane{$('div#editManagementUnitBlog')}
        adminTabPane(required: false) { module ManagementUnitAdminTab }
        editMUBlogTab{$('a#editManagementUnitBlog-tab')}
        editManagementUnitButton(required:false) { $('#edit-managementUnit-details .admin-action')}
        adminTab(required:false) { $('#admin-tab') }
        serviceProviderName(required:false){$('input#serviceProviderName', 0)}


    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

    List projectLinks(){
        projectLinksTd.collect{it.attr('href')}
    }

    List gotoProgram(){
        gotoProgramLinks.collect{it}
    }

    void openDocumentDialog() {
        adminTab.click()
        waitFor { adminTabPane.displayed }
        adminTabPane.attachDocument()
    }

    String currentServiceProviderName(){
        serviceProviderName.value()
    }

}
