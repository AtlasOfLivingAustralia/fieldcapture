package au.org.ala.merit

import au.org.ala.fieldcapture.WebService
import grails.converters.JSON


class SpeciesController {

    SpeciesService speciesService
    WebService webService

    def speciesProfile(String id) {

        Map result = speciesService.speciesProfile(id)
        render result as JSON
    }

    def speciesImage(String id) {

        String url = speciesService.speciesImageThumbnailUrl(id)

        webService.proxyGetRequest(response, url)
    }

    def searchBie() {

        Map results = speciesService.searchBie(params.q, params.limit ?: 10)
        println results
        render results as JSON
    }
}
