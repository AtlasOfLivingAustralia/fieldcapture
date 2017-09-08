package au.org.ala.merit

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
        if (url) {
            webService.proxyGetRequest(response, url)
        }
        else {

            String noImageUrl = asset.assetPath(src:'nophoto.png', absolute:true)
            response.sendRedirect(noImageUrl)
        }

    }

    def searchBie() {

        Map results = speciesService.searchBie(params.q, params.fq, params.limit ?: 10)
        println results
        render results as JSON
    }
}
