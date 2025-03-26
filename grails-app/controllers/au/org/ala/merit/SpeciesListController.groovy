package au.org.ala.merit

import au.org.ala.ecodata.forms.SpeciesListService

class SpeciesListController {

    static responseFormats = ['json', 'xml']
    private static final int DEFAULT_PAGE_SIZE = 500
    SpeciesListService speciesListService

    def speciesListItems(String druid, Integer pageSize, Integer page) {
        if (!druid) {
            respond null
        }
        List speciesList = speciesListService.speciesListItems(druid, pageSize ?: DEFAULT_PAGE_SIZE, page ?: 1)
        respond speciesList
    }
}
