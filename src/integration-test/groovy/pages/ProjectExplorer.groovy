package pages

import geb.Module
import geb.module.Checkbox
import pages.modules.ViewReef2050PlanReport

class FacetItem extends Module {
    static content = {
        link { $('a')}
        checkbox { $('input[type=checkbox]')}
        name { link.text() }

    }

    def select() {
        link.click()
    }

    def check() {
        checkbox.module(Checkbox).check()
    }
}

class Facet extends Module {

    static content = {
        title { $('.card-header a') }
        items { $('.card-body li').moduleList(FacetItem) }
    }

    FacetItem findItemByName(String name) {
        items.find{it.name == name}
    }

    def expand() {
        title.click()
        waitFor { items.size() == 0 || items[-1].displayed }
    }
}

class ProjectExplorer extends ReloadablePage {

    static url = "home/projectExplorer"

    static at = {
        waitFor { title == 'Explore | MERIT' }
    }

    static content = {
        mapToggle(required:false) { $('#mapHeading')}
        projectsToggle(required:false) { $('#projectHeading')}
        dashboardToggle(required:false) { $('#dashboardHeading') }
        downloadsToggle(required:false) { $('#downloadHeading') }

        projectTable{ $('#projectTable')}
        projectPagination(required:false) { $('#paginationInfo')}
        projects(required:false) { $('#projectTable tbody tr').moduleList(ProjectsList) }
        map(required:false) { $('#map') }
        chooseMoreFacetTerms(required: false) { $('#facetsContent .moreFacets') }
        facetTerms(required: false) { $("#facetsContent .accordion .card-header a") }
        facetAccordion(required: false) { $("#facetsContent .accordion") }

        inputText{ $("#keywords")}

        dashboardContent (required: false) {$("div#dashboard-content")}
        dashboardContentList (required: false) {$(".dashboard-activities")}
        reportView (required: false) {$("#reportView")}
        viewReef2050PlanReport(required: false) {module ViewReef2050PlanReport}

        facets(required: false) { facetAccordion.moduleList(Facet) }
    }

    /** When we reindex the index is destroyed and project explorer shows an error message about no data */
    boolean emptyIndex() {
        return mapToggle.empty
    }

    /** Reloads the page until indexing is complete */
    void waitForIndexing() {
        boolean empty = true
        while (empty) {
            driver.navigate().refresh()
            empty = emptyIndex()
        }
        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
    }

    Facet findFacetByName(String name) {
        facets.find{it.title.text() == name}
    }

    void displayProjectList() {
        if (projectsToggle.getAttribute('aria-expanded') != 'true') {
            projectsToggle.click()
        }
        waitFor 10,{ projectPagination.displayed }
    }

    void displayMapSection() {
        if (mapToggle.getAttribute('aria-expanded') != 'true') {
            mapToggle.click()
        }
        waitFor { map.displayed }
    }

    void displayDashboardSection() {
        if (dashboardToggle.getAttribute('aria-expanded') != 'true') {
            dashboardToggle.click()
        }
        waitFor { dashboardContent.displayed }
    }


}

class ProjectsList extends Module {
    static content = {
        name { $('.projectTitleName').text() }
        lastUpdated { $('.td2').text() }
        managementUnit { $(".managementUnitName").text()}
        linkToProject { $('.homeLine a') }
        description { $('.descLine').text() }
        downloadXlsx(required:false) { $('.downloadLine a') }
        downloadJson(required:false) { $('.downloadJSONLine a') }
    }

    def toggle() {
        $('a.projectTitle').click()
        waitFor {
            $('.descLine').displayed
        }
    }
}
