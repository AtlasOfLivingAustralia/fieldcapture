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
        // These cache items will not exist on startup (they are created when a test is run
        // that initialises them)
        programListCache(required:false){$('#programList')}
        serviceListCache(required:false){$('#serviceList')}
        protocolListCache(required:false){$('#monitoringProtocols')}
    }

    void clearHomePageStatistics(){
        waitFor {homePageStatistics.displayed}
        homePageStatistics.click()
    }

    void clearProgramListCache() {
        if (programListCache.displayed) {
            programListCache.click()
        }
    }

    void clearServiceListCache() {
        if (serviceListCache.displayed) {
            serviceListCache.click()
        }
    }

    void clearProtocolListCache() {
        if (protocolListCache.displayed) {
            protocolListCache.click()
        }
    }
}
