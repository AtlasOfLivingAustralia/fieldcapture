package pages

import geb.Page

class AdminClearCachePage extends Page {
    static url = "admin/cacheManagement"

    static at = { waitFor { title.startsWith("Cache Management | Admin | MERIT")}}

    static content = {
        userDetailsCache{ $("#userDetailsCache")}
        homePageImages{ $("#homePageImages")}
        speciesFieldConfig{ $("#speciesFieldConfig")}
        homePageBlog{ $("#homePageBlog")}
        grailsBlocksCache{ $("#grailsBlocksCache")}
        grailsTemplatesCache{ $("#grailsTemplatesCache")}
        homePageDocuments{ $("#homePageDocuments")}
        userProfileCache{ $("#userProfileCache")}
        homePageStatistics{ $("#homePageStatistics")}

    }
    void clearHomePageStatisticsCache(){
        waitFor {homePageStatistics.displayed}
        homePageStatistics.click()
    }
}
