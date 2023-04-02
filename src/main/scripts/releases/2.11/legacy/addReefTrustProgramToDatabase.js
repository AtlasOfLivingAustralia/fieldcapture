load('../../../utils/uuid.js');
load('../../../utils/program.js');

var reefTrust = createOrFindProgram('Reef Trust');


var subprograms = ["Reef Trust Phase 1 Investment","Reef Trust Phase 2 Investment","Reef Trust Phase 3 Investment", "Reef Trust Discretionary Grants", "Reef Trust Phase 4 Investment", "Reef Trust Phase 5 Investment", "Reef Trust Offsets", "Reef Trust Phase 6 Investment - 6 month", "Reef Trust Phase 6 Investment - 12 month"]


var projectReportsReefTrustPhase6Investment12month = [
    {
        reportType:'Activity',
        reportingPeriodInMonths: 12,
        "reportsAlignedToCalendar": true,
        reportNameFormat: "Stage %1d",
        reportDescriptionFormat: "Stage %1d for ${project.name}"
    }
]
var activitiesReefTrustPhase6Investment12month = [
    {
        name: "Administration, management & reporting",
        list: [
            {name:"Indigenous Employment and Businesses", description:"Activities that are primarily aimed at utilising Indigenous knowledge and resources to achieve improved NRM outcomes (e.g. Indigenous businesses, and Indigenous rangers).", type:"Activity"},
            {name:"Outcomes, Evaluation and Learning - final report", description:"Form for funding recipients to provide details of the project outcomes, evaluate its effectiveness and share lessons learnt. This activity is intended for use at the end of a project.", type:"Activity"},
            {name:"Project Administration", description:"Activities that primarily involve the management of non-site based components of a project (e.g. organising and attending committee meetings, submission of project reporting, procurement and contracting). It is expected that only one 'Project Administration' activity should be required for each stage of a project.", type:"Activity"},
            {name:"Progress, Outcomes and Learning - stage report", description:"Form for funding recipients to provide details of the progress on a project, including outcomes and essons learnt to date. This activity is intended for use at the end of each reporting stage of a project.", type:"Activity"}
        ]
    },
    {
        name:"Assessment & monitoring",
        list: [
            {name:"Fauna Survey - general", description:"Provides an opportunity to record data from native fauna surveys undertaken as part of a project", type:"Assessment"},
            {name:"Flora Survey - general", description:"Provides an opportunity to record data from native flora surveys undertaken as part of a project", type:"Assessment"},
            {name:"Pest Animal Survey", description:"Provides an opportunity to record data from exotic animal assessments undertaken as part of a project.", type:"Assessment"},
            {name:"Plant Survival Survey", description:"Activities that are primarily aimed at monitoring the success and effectiveness of revegetation activities.", type:"Assessment"},
            {name:"Site Monitoring Plan", description:"Activities that are primarily aimed at determining the specific details of monitoring activities that will be undertaken (e.g. determining the location, timing and method for vegetation condition monitoring, determining the method for exotic vertebrate species monitoring)", type:"Assessment"},
            {name:"Water Quality Survey", description:"Activities which involve monitoring of water quality by the collection of standard water quality measurement data.", type:"Assessment"},
            {name:"Weed Mapping & Monitoring", description:"Provides an opportunity to record data from weed mapping and monitoring undertaken as part of a project", type:"Assessment"},
            {name:"Vegetation Assessment - Commonwealth government methodology", description:"Provides an opportunity to record vegetation condition data collected using the Australian Government Department of the Environment Biodiversity Fund methodology.", type:"Assessment"}
        ]
    },
    {name:"Implementation actions",
        list:[
            {name:"Community Participation and Engagement", description:"Activities that are primarily aimed at raising awareness and increasing the skills and confidence of the target audience to address priority NRM issues (e.g. community information sessions, media articles and appearances, distribution of information materials). Use this form to record information about community events, subject matter, materials, participation and outcomes from the events.",type:"Activity"},
            {name:"Debris Removal", description:"Activities that primarily involve the removal of material debris (e.g. vegetation trunks and branches, human-made rubbish) from land, waterways, or the marine environment in order to avoid harm to species or habitat.",type:"Activity"},
            {name:"Disease Management", description:"Activities to reduce the impacts of diseases on environmental values or agricultural production.", type:"Activity"},
            {name:"Erosion Management", description:"Activities that are primarily aimed at stabilising or mitigating soil erosion of gullies, dune systems, river banks, and creeks (e.g. bank stabilisation works, dune stabilisation and restoration works).", type:"Activity"},
            {name:"Fencing", description:"Activities that primarily involve the installation of fencing to protect a NRM resource (e.g. to protect plantings from grazing). This can be as a separate activity or in association with another activity.", type:"Activity"},
            {name:"Conservation Grazing Management", description:"Activities that primarily involve the use of domesticated grazing livestock within a specific area to maintain or improve the condition of native vegetation (e.g. biomass control of native grasslands).", type:"Activity"},
            {name:"Ecological Fire Management", description:"", type:"Activity"},
            {name:"Fire Management", description:"Activities that primarily use fire as a tool to manage NRM resources (e.g. to improve vegetation condition, manage weeds).", type:"Activity"},
            {name:"Heritage Conservation", description:"Activities which involve assessment of and / or works on environmental or cultural heritage assets.", type:"Activity"},
            {name:"Management Plan Development", description:"Activities that primarily involve the development of a plan to manage or conserve NRM resources or the environment (e.g. site management plans, water quality improvement plans, conservation management plans).", type:"Activity"},
            {name:"Management Practice Change", description:"Activities that are primarily aimed at increasing the number of farmers and fishers using agriculture and fishing management practices aimed at protecting the resource base and increase productivity (e.g. addressing resource condition issues,  by retaining ground cover, no till farming).", type:"Activity"},
            {name:"Conservation Actions for Species and Communities", description:"", type:"Activity"},
            {name:"Pest Management", description:"Activities to reduce the impacts of pest animals on environmental values or agricultural production (including predation, competition for resources, loss or selective browsing of desirable species, and/or loss of groundcover).", type:"Activity"},
            {name:"Plant Propagation", description:"Activities which involve the propagation of seeds or vegetative materials to produce plants ready for planting out.", type:"Activity"},
            {name:"Public Access and Infrastructure", description:"Activities that are aimed at protecting a NRM asset from public access (e.g. traffic control, boardwalks, and signage).", type:"Activity"},
            {name:"Research", description:"Activities that are primarily aimed at testing and reporting on alternative NRM methodologies (e.g. propagation or revegetation methodology trials, preparation of research papers and articles).", type:"Activity"},
            {name:"Revegetation", description:"Activities that are primarily aimed at restoring native vegetation cover (e.g. tube stock planting, seed sowing, volunteer planting events).", type:"Activity"},
            {name:"Seed Collection", description:"Activities that primarily involve the collection and processing of native species seeds for the purpose of revegetation.", type:"Activity"},
            {name:"Site Preparation", description:"Activities that are primarily aimed at preparing a site for other activities (e.g. propagation for revegetation, ripping soil for revegetation).", type:"Activity"},
            {name:"Water Management", description:"Activities that are primarily aimed at improving aquatic habitats through improved water quality (e.g. water sensitive urban design, water regulation) or improving water usage (e.g. irrigation efficiency).", type:"Activity"},
            {name:"Weed Treatment", description:"Activities that primarily involve the physical, chemical or biological control of control of weed species to protect environmental assets or reduce impacts on primary production.", type:"Activity"},
            {name:"Works Planning and Risk",description:"Activities that are primarily aimed at determining the specific details of other activities that will be undertaken on a site. (e.g. determining the location, timing, method and species of revegetation to be undertaken). This activity is generally undertaken in a planning phase prior to undertaking works on a site. This activity is also used to assess the risks associated with works implementation on a site.",type:"Activity"}
        ]
    },
    {name:"Training",
        list:[
            {name:"Indigenous Knowledge Transfer",description:"Activities that are primarily aimed at sharing Indigenous knowledge.",type:"Activity"},
            {name:"Training and Skills Development",description:"Activities that are primarily aimed at increasing the knowledge and skills of farming, fishing and regional community leaders in sustainably managing NRM resources (e.g. workshops, trials, demonstrations, formal qualifications)",type:"Activity"}
        ]
    }
]

var config = {
    "projectReports": [
        {
            reportType:'Activity',
            reportingPeriodInMonths: 6,
            "reportsAlignedToCalendar": true,
            reportNameFormat: "Stage %1d",
            reportDescriptionFormat: "Stage %1d for ${project.name}"
        }
    ],
    excludes:["DATA_SETS"],
    "projectTemplate": "default",
    "activities": [
        {
            name: "Administration, management & reporting",
            list: [
                {name:"Indigenous Employment and Businesses", description:"Activities that are primarily aimed at utilising Indigenous knowledge and resources to achieve improved NRM outcomes (e.g. Indigenous businesses, and Indigenous rangers).", type:"Activity"},
                {name:"Outcomes, Evaluation and Learning - final report", description:"Form for funding recipients to provide details of the project outcomes, evaluate its effectiveness and share lessons learnt. This activity is intended for use at the end of a project.", type:"Activity"},
                {name:"Project Administration", description:"Activities that primarily involve the management of non-site based components of a project (e.g. organising and attending committee meetings, submission of project reporting, procurement and contracting). It is expected that only one 'Project Administration' activity should be required for each stage of a project.", type:"Activity"},
                {name:"Progress, Outcomes and Learning - stage report", description:"Form for funding recipients to provide details of the progress on a project, including outcomes and essons learnt to date. This activity is intended for use at the end of each reporting stage of a project.", type:"Activity"},
                {name:"Reef Trust Final Report", description:"", type:"Activity"}
            ]
        },
        {
            name:"Assessment & monitoring",
            list: [
                {name:"Fauna Survey - general", description:"Provides an opportunity to record data from native fauna surveys undertaken as part of a project", type:"Assessment"},
                {name:"Flora Survey - general", description:"Provides an opportunity to record data from native flora surveys undertaken as part of a project", type:"Assessment"},
                {name:"Pest Animal Survey", description:"Provides an opportunity to record data from exotic animal assessments undertaken as part of a project.", type:"Assessment"},
                {name:"Plant Survival Survey", description:"Activities that are primarily aimed at monitoring the success and effectiveness of revegetation activities.", type:"Assessment"},
                {name:"Site Monitoring Plan", description:"Activities that are primarily aimed at determining the specific details of monitoring activities that will be undertaken (e.g. determining the location, timing and method for vegetation condition monitoring, determining the method for exotic vertebrate species monitoring)", type:"Assessment"},
                {name:"Water Quality Survey", description:"Activities which involve monitoring of water quality by the collection of standard water quality measurement data.", type:"Assessment"},
                {name:"Weed Mapping & Monitoring", description:"Provides an opportunity to record data from weed mapping and monitoring undertaken as part of a project", type:"Assessment"},
                {name:"Vegetation Assessment - Commonwealth government methodology", description:"Provides an opportunity to record vegetation condition data collected using the Australian Government Department of the Environment Biodiversity Fund methodology.", type:"Assessment"}
            ]
        },
        {name:"Implementation actions",
            list:[
                {name:"Community Participation and Engagement", description:"Activities that are primarily aimed at raising awareness and increasing the skills and confidence of the target audience to address priority NRM issues (e.g. community information sessions, media articles and appearances, distribution of information materials). Use this form to record information about community events, subject matter, materials, participation and outcomes from the events.",type:"Activity"},
                {name:"Debris Removal", description:"Activities that primarily involve the removal of material debris (e.g. vegetation trunks and branches, human-made rubbish) from land, waterways, or the marine environment in order to avoid harm to species or habitat.",type:"Activity"},
                {name:"Disease Management", description:"Activities to reduce the impacts of diseases on environmental values or agricultural production.", type:"Activity"},
                {name:"Erosion Management", description:"Activities that are primarily aimed at stabilising or mitigating soil erosion of gullies, dune systems, river banks, and creeks (e.g. bank stabilisation works, dune stabilisation and restoration works).", type:"Activity"},
                {name:"Fencing", description:"Activities that primarily involve the installation of fencing to protect a NRM resource (e.g. to protect plantings from grazing). This can be as a separate activity or in association with another activity.", type:"Activity"},
                {name:"Conservation Grazing Management", description:"Activities that primarily involve the use of domesticated grazing livestock within a specific area to maintain or improve the condition of native vegetation (e.g. biomass control of native grasslands).", type:"Activity"},
                {name:"Fire Management", description:"Activities that primarily use fire as a tool to manage NRM resources (e.g. to improve vegetation condition, manage weeds).", type:"Activity"},
                {name:"Heritage Conservation", description:"Activities which involve assessment of and / or works on environmental or cultural heritage assets.", type:"Activity"},
                {name:"Management Plan Development", description:"Activities that primarily involve the development of a plan to manage or conserve NRM resources or the environment (e.g. site management plans, water quality improvement plans, conservation management plans).", type:"Activity"},
                {name:"Management Practice Change", description:"Activities that are primarily aimed at increasing the number of farmers and fishers using agriculture and fishing management practices aimed at protecting the resource base and increase productivity (e.g. addressing resource condition issues,  by retaining ground cover, no till farming).", type:"Activity"},
                {name:"Conservation Actions for Species and Communities", description:"", type:"Activity"},
                {name:"Pest Management", description:"Activities to reduce the impacts of pest animals on environmental values or agricultural production (including predation, competition for resources, loss or selective browsing of desirable species, and/or loss of groundcover).", type:"Activity"},
                {name:"Plant Propagation", description:"Activities which involve the propagation of seeds or vegetative materials to produce plants ready for planting out.", type:"Activity"},
                {name:"Public Access and Infrastructure", description:"Activities that are aimed at protecting a NRM asset from public access (e.g. traffic control, boardwalks, and signage).", type:"Activity"},
                {name:"Research", description:"Activities that are primarily aimed at testing and reporting on alternative NRM methodologies (e.g. propagation or revegetation methodology trials, preparation of research papers and articles).", type:"Activity"},
                {name:"Revegetation", description:"Activities that are primarily aimed at restoring native vegetation cover (e.g. tube stock planting, seed sowing, volunteer planting events).", type:"Activity"},
                {name:"Seed Collection", description:"Activities that primarily involve the collection and processing of native species seeds for the purpose of revegetation.", type:"Activity"},
                {name:"Site Preparation", description:"Activities that are primarily aimed at preparing a site for other activities (e.g. propagation for revegetation, ripping soil for revegetation).", type:"Activity"},
                {name:"Water Management", description:"Activities that are primarily aimed at improving aquatic habitats through improved water quality (e.g. water sensitive urban design, water regulation) or improving water usage (e.g. irrigation efficiency).", type:"Activity"},
                {name:"Weed Treatment", description:"Activities that primarily involve the physical, chemical or biological control of control of weed species to protect environmental assets or reduce impacts on primary production.", type:"Activity"},
                {name:"Works Planning and Risk",description:"Activities that are primarily aimed at determining the specific details of other activities that will be undertaken on a site. (e.g. determining the location, timing, method and species of revegetation to be undertaken). This activity is generally undertaken in a planning phase prior to undertaking works on a site. This activity is also used to assess the risks associated with works implementation on a site.",type:"Activity"},
                {name:"Sediment Savings",description:"",type:"Activity"}
            ]
        },
        {name:"Training",
            list:[
                {name:"Indigenous Knowledge Transfer",description:"Activities that are primarily aimed at sharing Indigenous knowledge.",type:"Activity"},
                {name:"Training and Skills Development",description:"Activities that are primarily aimed at increasing the knowledge and skills of farming, fishing and regional community leaders in sustainably managing NRM resources (e.g. workshops, trials, demonstrations, formal qualifications)",type:"Activity"}
            ]
        }
    ],
    "activityNavigationMode": "returnToProject"
};


for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], reefTrust._id);
    sub.config = config;

    if (sub.name === "Reef Trust Phase 6 Investment - 12 month"){
        config.projectReports = projectReportsReefTrustPhase6Investment12month;
    }
    if (sub.name === "Reef Trust Phase 6 Investment - 12 month"){
        config.activities = activitiesReefTrustPhase6Investment12month;
    }


    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    //inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    //update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:reefTrust.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}