package au.org.ala.fieldcapture

class ProjectService {

    def webService, grailsApplication

    def siteService  // temporary coupling for test data
    def projects

    def map() {
        if (!projects) {
            projects = siteService.getTestProjects()
            enrichTestData()
        }
        projects
    }

    def list() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/')
        resp.list
    }

    def get(id) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/' + id)
    }

    def update(id, body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/' + id, body)
    }

    def enrichTestData() {
        def p = projects['Bushbids'.encodeAsMD5()]
        if (p) {p.project_description = dummyProjects[0].project_description}
        projects.put dummyProjects[1].project_id, dummyProjects[1]
        projects.put dummyProjects[2].project_id, dummyProjects[2]
    }

    static dummyProjects = [
           [project_id: '21',
            project_external_id: 'DMS-10',
            project_name: 'Bushbids',
            project_manager: '',
            project_description: 'Within the South Australian Murray-Darling Basin, \n' +
                    'the northern Murray Plains and the southern parts of the \n' +
                    'Rangelands contain a concentration of remnant native \n' +
                    'woodlands on private land that are not well represented in \n' +
                    'conservation parks and reserves. The Woodland BushBids\n' +
                    'project will be implemented across this area.\n' +
                    'The eastern section of the Woodland BushBids project \n' +
                    'area contains large areas of woodland and mallee woodland \n' +
                    'where habitat quality could be improved through management. \n' +
                    'The western section contains smaller areas of priority woodland \n' +
                    'types in a largely cleared landscape. \n' +
                    'Protection and enhancement of native vegetation is \n' +
                    'necessary for the conservation of vegetation corridors through \n' +
                    'the region as well as management of woodland types such as \n' +
                    'Black Oak Woodlands. Management of native vegetation will \n' +
                    'also assist the protection of threatened species such as the \n' +
                    'Carpet Python, Regent Parrot, Bush Stone Curlew and the \n' +
                    'endangered Hopbush, Dodonea subglandulifera and will \n' +
                    'provide habitat for significant species such as the Southern \n' +
                    'Hairy Nosed Wombat.\n' +
                    'Woodland BushBids will assist landholders to provide \n' +
                    'management services to protect and enhance native\n' +
                    'vegetation quality.',
            group_id: '',
            group_name: 'Department of Water Land and Biodiversity Conservation',
            planned_start_date: '',
            planned_end_date: '',
            actual_start_date: '',
            actual_end_date: '',
            funding_source: '',
            funding_source_project_percent: '',
            planned_cost: 'not much',
            reporting_measures_addressed: '',
            project_planned_output_type: '',
            project_planned_output_value: '',
            project_sites: []
           ],
           [project_id: '11',
            project_external_id: 'DMS-10',
            project_name: 'The Great Koala Count',
            project_manager: 'me',
            project_description: 'The humble Australian koala was listed as an extinct animal in South Australia in the early 1900s, hounded from its home and shot on sight. In the 1930s researchers established colonies on Kangaroo Island to restore numbers, and now the state\'s populations are all deratives from the colony. In the eastern states of Australia, the koala is listed as endangered as the urban sprawl continues to engulf their natural habitats. On Wednesday, 28 November 2012, you can help monitor the population of koalas in South Australia with our Great Koala Count.',
            group_id: '',
            group_name: '',
            planned_start_date: '',
            planned_end_date: '',
            actual_start_date: '',
            actual_end_date: '',
            funding_source: 'drugs',
            funding_source_project_percent: '',
            planned_cost: 'not much',
            reporting_measures_addressed: '',
            project_planned_output_type: '',
            project_planned_output_value: '',
            project_sites: [],
            site_name: 'my back deck',
            region_name: 'ger_kosciuszko_to_coast',
            site_pid: '5388509'
           ],
            [project_id: '12',
            project_external_id: 'DMS-10',
            project_name: 'Border Ranges Project',
            project_manager: 'me',
            project_description: "This is the new site for the Border Ranges Alliance Atlas of Living Australia project. The project focuses on recording connectivity conservation activities in the Border Ranges (Great Eastern Ranges Initiative) region to compile and store activity data in the one location. This will allow the collaborative efforts of Border Ranges groups to be reported.\n" +
                    "\n" +
                    "The initial focus of the project is development and refinement of activity recording forms to improve the functionality of the system. The recording forms will continue to be added to, allowing more types of activities to be included, and to build on the types of 'outputs' that can be measured.",
            group_id: '',
            group_name: '',
            planned_start_date: '',
            planned_end_date: '',
            actual_start_date: '',
            actual_end_date: '',
            funding_source: 'drugs',
            funding_source_project_percent: '',
            planned_cost: 'not much',
            reporting_measures_addressed: '',
            project_planned_output_type: '',
            project_planned_output_value: '',
            project_sites: [],
            site_name: 'Border ranges',
            region_name: 'ger_border_ranges',
            site_pid: '5388061'
            ],
            [project_id: '1',
            project_external_id: 'DMS-10',
            project_name: 'my first project',
            project_manager: 'me',
            project_description: 'just a first test',
            group_id: '',
            group_name: '',
            planned_start_date: '',
            planned_end_date: '',
            actual_start_date: '',
            actual_end_date: '',
            funding_source: 'drugs',
            funding_source_project_percent: '',
            planned_cost: 'not much',
            reporting_measures_addressed: '',
            project_planned_output_type: '',
            project_planned_output_value: '',
            project_sites: [],
            site_name: 'my back deck',
            region_name: '',
            site_pid: 'wally'
            ],
           [project_id: '2',
            project_external_id: 'ALG-20',
            project_name: 'my second project',
            project_manager: 'me',
            project_description: 'just another test: Fluid grids utilize nesting differently: each nested level of columns should add up to 12 columns. This is because the fluid grid uses percentages, not pixels, for setting widths.',
            group_id: '',
            group_name: '',
            planned_start_date: '',
            planned_end_date: '',
            actual_start_date: '',
            actual_end_date: '',
            funding_source: 'poker',
            funding_source_project_percent: '',
            planned_cost: 'even less than project 1',
            reporting_measures_addressed: '',
            project_planned_output_type: '',
            project_planned_output_value: '',
            project_sites: [],
            site_name: 'my garden room',
            region_name: ''
            ]
    ]

    def bushbidsDescription = "Within the South Australian Murray-Darling Basin the northern Murray Plains and the southern parts of the Rangelands contain a concentration of remnant native woodlands on private land that are not well represented in conservation parks and reserves. The Woodland BushBids project will be implemented across this area. The eastern section of the Woodland BushBids project area contains large areas of woodland and mallee woodland where habitat quality could be improved through management. The western section contains smaller areas of priority woodland types in a largely cleared landscape. Protection and enhancement of native vegetation is necessary for the conservation of vegetation corridors through the region as well as management of woodland types such as Black Oak Woodlands. Management of native vegetation will also assist the protection of threatened species such as the Carpet Python, Regent Parrot, Bush Stone Curlew and the endangered Hopbush, Dodonea subglandulifera and will provide habitat for significant species such as the Southern Hairy Nosed Wombat. Woodland BushBids will assist landholders to provide management services to protect and enhance native vegetation quality."
}
