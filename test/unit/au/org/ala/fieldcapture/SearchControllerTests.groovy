package au.org.ala.fieldcapture

import grails.test.mixin.TestFor

/**
 * Tests the SearchController
 */
@TestFor(SearchController)
class SearchControllerTests {

    /** A basic test for filtering the results from the species list service */
    void testSpeciesSearch() {

        def webService = mockFor(WebService)
        webService.demand.get { String url -> testResult }
        controller.webService = webService.createMock()

        controller.params.druid = "dr895"
        controller.species("Acacia attenuata", 10)

        assert controller.response.text == """{"autoCompleteList":[{"id":14966,"name":"Acacia attenuata Maiden & Blakely","matchedNames":["Acacia attenuata Maiden & Blakely"],"guid":"urn:lsid:biodiversity.org.au:apni.taxon:254715"}]}"""
    }


    private String testResult = """
[
    {
        "id": 14948,
        "name": "Acacia podalyriifolia A.Cunn. ex G.Don",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298713"
    },
    {
        "id": 14949,
        "name": "Acacia leptocarpa A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257430"
    },
    {
        "id": 14950,
        "name": "Acacia blakei Pedley subsp. blakei",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257550"
    },
    {
        "id": 14951,
        "name": "Acacia implexa Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297554"
    },
    {
        "id": 14952,
        "name": "Acacia farnesiana (L.) Willd.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297290"
    },
    {
        "id": 14953,
        "name": "Acacia fasciculifera F.Muell. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254853"
    },
    {
        "id": 14954,
        "name": "Acacia cambagei R.T.Baker",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257349"
    },
    {
        "id": 14955,
        "name": "Acacia glaucocarpa Maiden & Blakely",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254656"
    },
    {
        "id": 14956,
        "name": "Acacia harpophylla F.Muell. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257350"
    },
    {
        "id": 14957,
        "name": "Acacia baueri Benth. subsp. baueri",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296252"
    },
    {
        "id": 14958,
        "name": "Acacia semirigida Maiden & Blakely",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254801"
    },
    {
        "id": 14959,
        "name": "Acacia suaveolens (Sm.) Willd.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:302179"
    },
    {
        "id": 14960,
        "name": "Acacia sp. (Comet L.Pedley 4091)",
        "lsid": null
    },
    {
        "id": 14961,
        "name": "Acacia leptostachya Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257568"
    },
    {
        "id": 14962,
        "name": "Acacia decora Rchb.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296849"
    },
    {
        "id": 14963,
        "name": "Acacia quadrilateralis DC.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254862"
    },
    {
        "id": 14964,
        "name": "Acacia sp. (Bulburin W.J.McDonald 3208)",
        "lsid": null
    },
    {
        "id": 14965,
        "name": "Acacia sophorae (Labill.) R.Br.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:574144"
    },
    {
        "id": 14966,
        "name": "Acacia attenuata Maiden & Blakely",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254715"
    },
    {
        "id": 14967,
        "name": "Acacia ulicifolia (Salisb.) Court",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:302393"
    },
    {
        "id": 14968,
        "name": "Acacia falciformis DC.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297283"
    },
    {
        "id": 14969,
        "name": "Acacia excelsa Benth. subsp. excelsa",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297242"
    },
    {
        "id": 14970,
        "name": "Acacia maidenii F.Muell.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:255299"
    },
    {
        "id": 14971,
        "name": "Acacia irrorata Sieber ex Spreng. subsp. irrorata",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297622"
    },
    {
        "id": 14972,
        "name": "Acacia macradenia Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254711"
    },
    {
        "id": 14973,
        "name": "Acacia hubbardiana Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254830"
    },
    {
        "id": 14974,
        "name": "Acacia brachycarpa Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:255002"
    },
    {
        "id": 14975,
        "name": "Acacia aulacocarpa A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296171"
    },
    {
        "id": 14976,
        "name": "Acacia cincinnata F.Muell.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296546"
    },
    {
        "id": 14977,
        "name": "Acacia melanoxylon R.Br.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298260"
    },
    {
        "id": 14978,
        "name": "Acacia longissima H.L.Wendl.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298064"
    },
    {
        "id": 14979,
        "name": "Acacia ixiophylla Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257197"
    },
    {
        "id": 14980,
        "name": "Acacia complanata A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296653"
    },
    {
        "id": 14981,
        "name": "Acacia flavescens A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297368"
    },
    {
        "id": 14982,
        "name": "Acacia bakeri Maiden",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257412"
    },
    {
        "id": 14983,
        "name": "Acacia falcata Willd.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297281"
    },
    {
        "id": 14984,
        "name": "Acacia oshanesii F.Muell. & Maiden",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254670"
    },
    {
        "id": 14985,
        "name": "Acacia crassa subsp. longicoma Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257422"
    },
    {
        "id": 14986,
        "name": "Acacia caroleae Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257575"
    },
    {
        "id": 14987,
        "name": "Acacia conferta A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:314172"
    },
    {
        "id": 14988,
        "name": "Acacia bidwillii Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:302562"
    },
    {
        "id": 14989,
        "name": "Acacia leiocalyx subsp. herveyensis Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297822"
    },
    {
        "id": 14990,
        "name": "Acacia myrtifolia (Sm.) Willd.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298407"
    },
    {
        "id": 14991,
        "name": "Acacia oswaldii F.Muell.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298583"
    },
    {
        "id": 14992,
        "name": "Acacia decurrens Willd.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296891"
    },
    {
        "id": 14993,
        "name": "Acacia leiocalyx (Domin) Pedley subsp. leiocalyx",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297821"
    },
    {
        "id": 14994,
        "name": "Acacia fimbriata A.Cunn. ex G.Don",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297348"
    },
    {
        "id": 14995,
        "name": "Acacia amblygona A.Cunn. ex Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:255014"
    },
    {
        "id": 14996,
        "name": "Acacia julifera Benth. subsp. julifera",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297705"
    },
    {
        "id": 14997,
        "name": "Acacia salicina Lindl.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:299198"
    },
    {
        "id": 14998,
        "name": "Acacia holosericea A.Cunn. ex G.Don var. holosericea",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297481"
    },
    {
        "id": 14999,
        "name": "Acacia penninervis var. longiracemosa Domin",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254703"
    },
    {
        "id": 15000,
        "name": "Acacia pubicosta C.T.White",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:254778"
    },
    {
        "id": 15001,
        "name": "Acacia juncifolia Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:297708"
    },
    {
        "id": 15002,
        "name": "Acacia penninervis Sieber ex DC. var. penninervis",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:298663"
    },
    {
        "id": 15003,
        "name": "Acacia disparrima M.W.McDonald & Maslin subsp. disparrima",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296942"
    },
    {
        "id": 15004,
        "name": "Acacia viscidula Benth.",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:302471"
    },
    {
        "id": 15005,
        "name": "Acacia concurrens Pedley",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:257423"
    },
    {
        "id": 15006,
        "name": "Acacia bancroftiorum Maiden",
        "lsid": "urn:lsid:biodiversity.org.au:apni.taxon:296192"
    }
]"""
}
