package pages

class AdminClearCachePage extends ReloadablePage {
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
        programListCache{$('#programList')}


    }

    void clearHomePageStatistics(){
        waitFor {homePageStatistics.displayed}
        homePageStatistics.click()
    }

    void clearProgramListCache() {
        waitFor {programListCache.displayed }
        programListCache.click()
    }
}
