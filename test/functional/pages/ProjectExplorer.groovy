package pages

import geb.Module
import geb.Page

class ProjectExplorer extends Page {

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
        facets(required: false) { $('#facetsContent input') }
        chooseMoreFacetTerms(required: false) { $('#facetsContent .moreFacets') }
        facetTerms(required: false) { $("#facetsContent .accordion .card-header a") }
        facetAccordion(required: false) { $("#facetsContent .accordion") }

        inputText{ $("#keywords")}

        dashboardContent (required: false) {$("div#dashboard-content")}
        dashboardContentList (required: false) {$(".dashboard-activities")}
        reportView (required: false) {$("#reportView")}
        dashboardType (required: false) { $("#dashboardType") }
        reefReportContent (required: false) { $("#reportContents") }
    }

    /** When we reindex the index is destroyed and project explorer shows an error message about no data */
    boolean emptyIndex() {
        return mapToggle.empty
    }
//
//    void searchProject(){
//        waitFor {search.displayed}
//        search.click()
//    }

}

class ProjectsList extends Module {
    static content = {
        name { $('.projectTitleName').text() }
        lastUpdated { $('.td2').text() }
        managementUnit { $(".managementUnitName").text()}
    }
}


////class DashboardContent extends Module{
////    static content = {
////        heading{$("")}
////
////
////    }
//}
