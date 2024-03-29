package au.org.ala.merit

class SpeciesService {

    def webService, grailsApplication

    def searchForSpecies(searchTerm, String fq = null, limit = 10, listId = null) {

        // Try the project species list first.
        if (listId) {
            def results = filterSpeciesList(searchTerm, listId)
            if (results.count) {
                return results
            }
        }
        def results = searchBie(searchTerm, fq, limit)

        // standardise output
        // Handle some unhelpful results from the BIE.
        results?.autoCompleteList?.removeAll { !it.name }

        results?.autoCompleteList?.each { result ->
            result.scientificName = result.name
            if(result.commonName && result.commonName.contains(',')) { // ?. doesn't use groovy truth so throws exception for JSON.NULL
                result.commonName = result.commonName.split(',')[0]
            }
        }

        return results
    }

    def searchSpeciesInLists(searchTerm, lists, limit = 10){ def results
        def autoCompleteList = []
        lists?.each{ list ->
            def listResults =  filterSpeciesList(searchTerm, list?.dataResourceUid)
            listResults.autoCompleteList?.each{
                autoCompleteList << it
            }
        }
        results = [autoCompleteList: autoCompleteList]
    }

    /**
     * Searches for an exact match of scientific name in the BIE and optionally a project list.
     * @param scientificName the scientific name of the taxa to search for.
     * @param listId the list to search if desired.
     * @return the matching taxa, or null if not match was found.
     */
    def searchByScientificName(scientificName, listId = null) {
        def results = searchForSpecies(scientificName, null, 10, listId)
        return results.autoCompleteList?.find {it.name.equalsIgnoreCase(scientificName)}
    }

    /**
     * Searches each result supplied list to find a name that matches (in a case insensitive manner) the supplied name.
     * This method expects the format of each result to be as returned from the BIE species autocomplete function.
     * @param speciesSearchResults the list of results.
     * @param name the name to match.
     * @return the result that matches the supplied name, or null if no match is found.
     */
    Map findMatch(Map speciesSearchResults, String name) {
        speciesSearchResults?.autoCompleteList?.find { result ->
            (result.name == name || result.matchedNames?.find { matchedName -> name.equalsIgnoreCase(matchedName) })
        }
    }

    /**
     * Searches the "name" returned by the Species List service for the supplied search term and reformats the
     * results to match those returned by the bie.
     * @param query the term to search for.
     * @param listId the id of the list to search.
     * @return a JSON formatted String of the form {"autoCompleteList":[{...results...}]}
     */
    private def filterSpeciesList(String query, String listId) {
        def listContents = webService.getJson("${grailsApplication.config.getProperty('lists.baseURL')}/ws/speciesListItems/${listId}?q=${query}")

        def filtered = listContents.collect({[id: it.id, listId: listId, name: it.name, commonName: it.commonName, scientificName: it.scientificName, scientificNameMatches:[it.name], guid:it.lsid]})

        def results = [:];
        results.autoCompleteList = filtered
        results.count = filtered.size()

        return results
    }

    def searchBie(String searchTerm, String fq, limit) {
        if (!limit) {
            limit = 10
        }
        def encodedQuery = URLEncoder.encode(searchTerm ?: '', "UTF-8")
        String url = "${grailsApplication.config.getProperty('bie.service.baseURL')}/ws"
        if (fq) {
            String encodedFacetQuery = URLEncoder.encode(fq, 'UTF-8')
            url += "/search.json?q=${encodedQuery}&fq=${encodedFacetQuery}&pageSize=${limit}"
        }
        else {
            def encodedFq = URLEncoder.encode(fq ?: '', "UTF-8")
            url += "/search/auto.jsonp?q=${encodedQuery}&limit=${limit}&idxType=TAXON"

        }
        webService.getJson(url)
    }

    def searchSpeciesList(String sort = 'listName', Integer max = 100, Integer offset = 0, String guid = null, String order = "asc", String searchTerm = null) {
        def list
        String url = "${grailsApplication.config.getProperty('lists.baseURL')}/ws/speciesList?sort=${sort}&max=${max}&offset=${offset}&order=${order}"

        if (!guid & !searchTerm) {
            list = webService.getJson(url)
        } else {
            if (guid) {
                // Search List by species in the list
                url = "${url}&items=createAlias:items&items.guid=eq:${guid}"
                list = webService.getJson(url)
            }
            if (searchTerm) {
                // Search list by list name
                def searchList = getAllSpeciesList()
                def toLowerSearchTerm = searchTerm.toLowerCase()
                // remove list that don't match the name
                searchList.lists.removeAll { !(it.listName.toLowerCase() =~ /\A${toLowerSearchTerm}/) }
                if (list) {
                    list.lists.addAll(searchList.lists)
                } else {
                    list = searchList
                }
                list.lists.unique()
                list.listCount = list.lists.size()
            }
        }

        list

    }


    Map getSingleSpecies(Map speciesFieldConfig) {
        Map result = [isSingle: false]

        switch (speciesFieldConfig?.type) {
            case 'SINGLE_SPECIES':
                result.isSingle = true

                if (speciesFieldConfig?.singleSpecies?.guid) {
                    result.name = formatSpeciesName(speciesFieldConfig.speciesDisplayFormat, speciesFieldConfig.singleSpecies)
                    result.guid = speciesFieldConfig.singleSpecies?.guid
                    result.scientificName = speciesFieldConfig.singleSpecies?.scientificName
                    result.commonName = speciesFieldConfig.singleSpecies?.commonName
                }
                break
        }
        result
    }

    /**
     * formats a name into the specified format
     * if species does not match to a taxon, then mention it in name.
     * @param displayType
     * @param data
     * @return
     */
    String formatSpeciesName(String displayType, Map data){
        String name
        if(data.guid){
            switch (displayType){
                case 'COMMONNAME(SCIENTIFICNAME)':
                    if(data.commonName){
                        name = "${data.commonName} (${data.scientificName})"
                    } else {
                        name = "${data.scientificName}"
                    }
                    break;
                case 'SCIENTIFICNAME(COMMONNAME)':
                    if(data.commonName){
                        name = "${data.scientificName} (${data.commonName})"
                    } else {
                        name = "${data.scientificName}"
                    }

                    break;
                case 'COMMONNAME':
                    if(data.commonName){
                        name = "${data.commonName}"
                    } else {
                        name = "${data.scientificName}"
                    }
                    break;
                case 'SCIENTIFICNAME':
                    name = "${data.scientificName}"
                    break;
            }
        } else {
            // when no guid, append unmatched taxon string
            name = "${data.name} (Unmatched taxon)"
        }

        name
    }

    Object searchSpeciesForConfig(Map speciesConfig, String q, Integer limit) {
        def result
        switch (speciesConfig?.type) {
            case 'SINGLE_SPECIES':
                result = searchForSpecies(speciesConfig?.singleSpecies?.name, null, 1)
                break

            case 'ALL_SPECIES':
                result = searchForSpecies(q, speciesConfig?.fq, null, limit)
                break

            case 'GROUP_OF_SPECIES':
                def lists = speciesConfig?.speciesLists
                result = searchSpeciesInLists(q, lists, limit)
                break
            default:
                result = [autoCompleteList: []]
                break
        }
        return result
    }

    List formatSpeciesNameForSurvey(String speciesDisplayFormat, Map data){
        data?.autoCompleteList?.each{
            it.name = formatSpeciesName(speciesDisplayFormat?:'SCIENTIFICNAME(COMMONNAME)', it)
        }
    }

    def addSpeciesList(postBody) {
        webService.doPost("${grailsApplication.config.getProperty('lists.baseURL')}/ws/speciesList", postBody)
    }

    def getAllSpeciesList(){
        // 1000 is the maximum that species list could give right now.
        String url = "${grailsApplication.config.getProperty('lists.baseURL')}/ws/speciesList?sort=listName&offset=0&max=1000"
        webService.getJson(url)
    }

    /**
     * Returns a thumbnail image for the supplied GUID.
     * @param id the species GUID.
     * @return
     */
    String speciesImageThumbnailUrl(String id) {

        Map profile = speciesProfile(id)
        return profile.thumbnail
    }

    Map speciesProfile(String id) {

        // While the BIE is in the process of being cut over to the new version we have to handle both APIs.
        def url = "${grailsApplication.config.getProperty('bie.baseURL')}/ws/species/shortProfile/${id}"
        webService.getJson(url)
    }
}
