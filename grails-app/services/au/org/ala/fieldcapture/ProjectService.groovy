package au.org.ala.fieldcapture

class ProjectService {

    def list() {
        dummyProjects
    }

    def get(id) {
        return dummyProjects.find { it.project_id == id }
    }

    static dummyProjects = [
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
            project_sites: '',
            site_name: 'my back deck',
            region_name: 'ger_kosciuszko_to_coast'
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
            project_sites: '',
            site_name: 'Border ranges',
            region_name: 'ger_border_ranges'
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
            project_sites: '',
            site_name: 'my back deck',
            region_name: ''
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
            project_sites: '',
            site_name: 'my garden room',
            region_name: ''
            ]
    ]
}
