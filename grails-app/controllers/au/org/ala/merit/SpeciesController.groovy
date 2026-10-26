package au.org.ala.merit

import grails.converters.JSON

import au.org.ala.ecodata.utils.ResponseCacheHeaderUtils

class SpeciesController {

    SpeciesService speciesService
    WebService webService

    def speciesProfile(String id) {

        Map result = speciesService.speciesProfile(id)
        if (result && result.scientificName) {
            ResponseCacheHeaderUtils.applyCacheHeaders(response, ResponseCacheHeaderUtils.ONE_DAY_IN_SECONDS)
        }
        render result as JSON
    }

    def speciesImage(String id) {

        String url = speciesService.speciesImageThumbnailUrl(id)
        if (url) {
            ResponseCacheHeaderUtils.applyCacheHeaders(response, ResponseCacheHeaderUtils.ONE_DAY_IN_SECONDS)
            webService.proxyGetRequest(response, url)
        }
        else {
            String noImageUrl = asset.assetPath(src:'nophoto.png', absolute:true)
            response.sendRedirect(noImageUrl)
        }
        return null
    }

    def searchBie() {

        Map results = speciesService.searchBie(params.q, params.fq, params.limit ?: 10)
        render results as JSON
    }
}
