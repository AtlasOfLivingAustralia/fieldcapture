print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + process.cwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');
loadActivityForms();

createProgram({});
var config = {
    projectTemplate: "rlp",
    meriPlanTemplate: "configurableMeriPlan",
    supportsMeriPlanComparison: true,
    meriPlanContents: [
        {
            "template": "objectivesList"
        },
        {
            "template": "monitoringIndicators"
        },
        {
            "template": "projectImplementation"
        },
        {
            "template": "projectPartnerships"
        },
        {
            "template": "keq"
        },
        {
            "template": "meriBudget"
        }
    ],
    objectives: [
        "objective 1",
        "objective 2",
        "objective 3"
    ]
};
createProgram({
    programId: "configurable_meri_plan",
    name: "Configurable MERI Plan Program",
    description: "",
    config: config
});
createMu({});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Program',
    entityId: 'test_program',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '1',
    accessLevel: 'admin'
});

var outputTargets = [
    {
        scoreId:'score_42',
        target:'10',
        outcomeTargets:[{relatedOutcomes:['ST1'], target:'10'}]
    },
    {
        scoreId: "score_44",
        target: NumberDecimal("1"),
        periodTargets:[{period:"2018/2019", target: NumberDecimal("1")}]
    },
    {
        scoreId: 'score_43',
        target: '1'
    }
];

var serviceIds = [1, 2, 33];

for (var i = 1; i < 10; i++) {
    var id = '' + i;

    let projectServiceIds = i == 3 ? [] :serviceIds;
    let projectOutputTargets = i == 3 ? [] : outputTargets;
    createProject({name: 'Project ' + id, projectId: id, outputTargets: projectOutputTargets, custom:{details:{serviceIds:projectServiceIds}}});


    createSite({name: "Test site " + id, siteId: 'test_site_' + id, projects: [id]});
    if (i < 4) {
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '1',
            accessLevel: 'admin'
        });
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '10',
            accessLevel: 'editor'
        });
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '1001',
            accessLevel: 'caseManager'
        });
    }
}

createProject({projectId: "meri1", name: "Configurable MERI plan project", programId: "configurable_meri_plan", plannedStartDate: ISODate("2015-06-30T14:00:00Z"), plannedEndDate: ISODate("2016-06-30T14:00:00Z")});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "meri1",
    userId: '1',
    accessLevel: 'admin'
});

var programWithDefaultOutcome = programDefaults.create();
programWithDefaultOutcome.outcomes[2].default = true;
programWithDefaultOutcome.programId  = 'default_outcome';
programWithDefaultOutcome.name =  "Default outcome";
programWithDefaultOutcome.config.supportsMeriPlanComparison = true;

db.program.insert(programWithDefaultOutcome);

createProject({projectId: "defaultOutcome", name: "Default outcome project", programId: "default_outcome"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "defaultOutcome",
    userId: '1',
    accessLevel: 'admin'
});

createOrganisation({
    name:'THE TRUSTEE FOR PSS FUND Test',
    organisationId:'test_organisation',
    status:'active', abn:'',
    url:'http://www.ala.org.au',
    acronym:'TSTORG', description:'THE TRUSTEE FOR PSS FUND Test'
})

createProject({name:'project active', projectId:"project_active", status:"active", planStatus:'submitted', externalIds:[{idType:'INTERNAL_ORDER_NUMBER', externalId:'12345'}], programId:'default_outcome', plannedStartDate: ISODate("2023-12-01T14:00:00Z"), plannedEndDate: ISODate("2024-08-01T14:00:00Z") })
createProject({name:'project application', projectId:"project_application", status:"application", planStatus:'submitted', programId:'default_outcome', externalIds:[]})
createProject({name:'project completed', projectId:"project_completed", status:"completed", planStatus:'submitted', externalIds:[{idType:'INTERNAL_ORDER_NUMBER', externalId:'12345'}], programId:'default_outcome'})

db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_active', userId:'1001', accessLevel:'caseManager'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_application', userId:'1001', accessLevel:'caseManager'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_completed', userId:'1001', accessLevel:'caseManager'});


createProgram({programId:"grants", name:"Grant Program"});
var grantProgram = db.program.findOne({programId:"grants"});
grantProgram.config.projectTemplate=null;
grantProgram.config.meriPlanTemplate=null;
db.program.replaceOne({_id:grantProgram._id}, grantProgram);
createProject({name:'Grants project', projectId:"grants_project", programId:"grants", status:"active", planStatus:'',
    custom: {details: {objectives: {rows1:[{assets:["Threatened Species"], description:"Objective 1"}, {assets: ["Threatened Species"], description: "Objective 2"}]}}}});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'grants_project', userId:'2', accessLevel:'admin'});

addSetting('meritfielddata.rlp.report.declaration', 'Report declaration text');
addSetting('meritfielddata.rlp.report.submitted.emailSubject', 'Report submitted subject');
addSetting('meritfielddata.rlp.report.submitted.emailBody', 'Report submitted body');
addSetting('meritfielddata.rlp.report.approved.emailSubject', 'Report approved subject');
addSetting('meritfielddata.rlp.report.approved.emailBody', 'Report approved body');
addSetting('meritfielddata.rlp.report.returned.emailSubject', 'Report returned subject');
addSetting('meritfielddata.rlp.report.returned.emailBody', 'Report returned body');

addSetting('meritfielddata.rlp.meriPlanSubmitted.emailSubject', 'Plan submitted subject');
addSetting('meritfielddata.rlp.meriPlanApproved.emailSubject', 'Plan submitted body');
addSetting('meritfielddata.rlp.meriPlanRejected.emailSubject', 'Plan approved subject');
addSetting('meritfielddata.rlp.meriPlanSubmitted.emailText', 'Plan submitted subject');
addSetting('meritfielddata.rlp.meriPlanApproved.emailText', 'Plan submitted body');
addSetting('meritfielddata.rlp.meriPlanRejected.emailText', 'Plan approved subject');
addSetting('meritfielddata.rlp.planSubmitted.emailSubject', 'Plan submitted subject');
addSetting('meritfielddata.rlp.planApproved.emailSubject', 'Plan submitted body');
addSetting('meritfielddata.rlp.planRejected.emailSubject', 'Plan approved subject');
addSetting('meritfielddata.rlp.planSubmitted.emailText', 'Plan submitted subject');
addSetting('meritfielddata.rlp.planApproved.emailText', 'Plan submitted body');
addSetting('meritfielddata.rlp.planRejected.emailText', 'Plan approved subject');


// Load scores used by RLP services to enable their selection in the MERI plan.
createProjectNumberBaselineDataSets({ "scoreId":"score_42"});
createProjectNumberOfCommunicationMaterialsPublished({ "scoreId":"score_43"});
createProjectWeedAreaSurveyedHaDefault({ "scoreId":"score_44"});
createScore(totalBaselineFloraSurveysDefault, {scoreId:"score_flora_baseline"});
createScore(totalIndicatorFloraSurveysDefault, {scoreId:"score_flora_indicator"});


// This section creates a program that uses the new grants workflow
const configForGrantsProgram = {
    "meriPlanContents": [
        {
            "template": "name",
            "model": {
                "tableFormatting": true
            }
        },
        {
            "template": "priorityPlace",
            "model": {
                "priorityPlaceHelpText": "Priority places recognises that some threatened species share the same habitat, and that place-based action can support protection and recovery of more than one species.",
                "priorityPlaceLabel": "Does this project directly support a priority place?"
            }
        },
        {
            "template": "indigenousInvolvement"
        },
        {
            "template": "description",
            "model": {
                "tableFormatting": true,
                "maxSize": "1000",
                "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
            }
        },
        {
            "template": "programOutcome",
            "model": {
                "maximumPriorities": "1000",
                "priorityHelpText": "Enter the primary investment priority for the primary outcome, noting only one can be selected."
            }
        },
        {
            "template": "additionalOutcomes",
            "model": {
                "outcomePriority": "Additional outcome/s",
                "helpTextHeading": "If the project is not delivering additional benefits, delete the row using the 'x' in the right-most column.",
                "title": "Additional benefits",
                "priority": "Additional Investment Priorities",
                "priorityHelpText": "Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
            }
        },
        {
            "template": "outcomeStatements",
            "model": {
                "outcomeType": "project",
                "helpText": "",
                "minimumNumberOfOutcomes": 1,
                "subtitle": "Project outcome statement/s",
                "title": "Project Outcomes",
                "extendedOutcomes": true
            }
        },
        {
            "template": "extendedKeyThreats",
            "model": {
                "servicesHeading": "Which activities will be used to address these threats?",
                "threatsHeading": "Key threats / barriers / issues the project is addressing",
                "methodologyHeading": "How will you carry out the activities to support this?",
                "title": "Threats, Barriers and Issues",
                "descriptionHeading": "How have these threats or barriers impacted the investment priority"
            }
        },
        {
            "template": "extendedBaselineMonitoring",
            "model": {
                "numberOfMandatoryRows": 0,
                "approachHeading": "Monitoring method",
                "indicatorHeading": "Monitoring methodology",
                "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
                "baselineDataDescriptionHelpText": "Describe the project baseline to be established, or the baseline data that currently exists",
                "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                "baselineDataHelpText": "Existing baseline data needs to be based on best practice methods and be compatible with the EMSA protocols.",
                "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s).  Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
                "newIndicatorText": "New monitoring indicator"
            }
        },
        {
            "template": "serviceOutcomeTargetsWithForecasts",
            "model": {
                "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections",
                "separateTargetsPerOutcome": true,
                "title": "Project services and targets",
                "serviceName": "Service"
            }
        },
        {
            "template": "projectMethodology",
            "model": {
                "helpText": "In addition to listing your project assumptions, please list any nominated project services that will not be charged for.\nInclude all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic.",
                "maxSize": "4000",
                "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words])"
            }
        },
        {
            "template": "projectPartnerships",
            "model": {
                "helpTextHeading": "Note: Not limited to key subcontractors.",
                "helpTextPartnerName": "Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project"
            }
        },
        {
            "template": "projectReview",
            "model": {
                "title": "Project review, improvement and evaluation methodology and approach (3000 character limit [approximately 500 words])"
            }
        },
        {
            "template": "nationalAndRegionalPlans",
            "model": {
                "includeUrl": true,
                "headingTitle": "Supporting documents"
            }
        },
        {
            "template": "attachmentFooter",
            "model": {
                "heading": "MERI Attachments",
                "attachmentText": "Please attach Project logic to your MERI plan using the documents function on the Admin tab.  A \"Document type\" of \"Project Logic\" should be selected when uploading the document."
            }
        }
    ],
    "excludes": [],
    "programServiceConfig": {
        "serviceFormName": "Enhanced Grants Progress Report",
        "filterServicesByForecasts": true,
        "programServices": [
            {
                "serviceTargets": [
                    "score_42"
                ],
                "serviceId": 1
            },
            {
                "serviceTargets": [
                    "score_43"
                ],
                "serviceId": 2
            },
            {
                "serviceTargets": [
                    "score_flora_baseline",
                    "score_flora_indicator"
                ],
                "serviceId": 15 // flora survey
            }
        ]
    },
    "visibility": "public",
    "declarationPageType": "rdpReportDeclaration",
    "requiresActivityLocking": true,
    "supportsMeriPlanComparison": true,
    "projectTemplate": "rlp",
    "activityPeriodDescriptor": "Outputs report #",
    "requireMeritAdminToReturnMeriPlan": false,
    "emailTemplates": {
        "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
        "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
        "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
        "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
        "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
        "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
    },
    "meriPlanTemplate": "configurableMeriPlan",
    "riskAndThreatTypes": [
        "Performance",
        "Work Health and Safety",
        "People resources",
        "Financial",
        "External stakeholders",
        "Natural Environment"
    ],
    "projectReports": [
        {
            "reportType": "Activity",
            "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
            "reportDescriptionFormat": "Progress Report %1d",
            "reportNameFormat": "Progress Report %1d",
            "reportingPeriodInMonths": 6,
            "description": "",
            "minimumReportDurationInDays": 3,
            "label": "Semester",
            "category": "Progress Reports",
            "activityType": "Enhanced Grants Progress Report",
            "reportsAlignedToCalendar": true,
            "canSubmitDuringReportingPeriod": true
        },
        {
            "reportType": "Single",
            "reportDescriptionFormat": "Final Report",
            "reportNameFormat": "Final Report",
            "reportingPeriodInMonths": 0,
            "multiple": false,
            "description": "",
            "alignToOwnerEnd": true,
            "label": "Final Report",
            "category": "Final Report",
            "reportsAlignedToCalendar": false,
            "activityType": "Non RDP Final Report",
            "alignToOwnerStart": true
        }
    ],
    "targetsConfig": {
        "periodGenerationConfig": {
            "reportType": "Targets",
            "reportDescriptionFormat": "Report %d",
            "reportNameFormat": "%2$tb %2$tY - %3$tb %3$tY",
            "reportingPeriodInMonths": 6,
            "minimumReportDurationInDays": 1,
            "label": "6 monthly",
            "category": "Targets",
            "activityType": "n/a"
        },
        "periodLabelFormat": "MMM YYYY"
    },
    "keyThreatCodes": [
        "Climate Change - Changed flooding regime",
        "Climate Change - Changed rainfall patterns",
        "Climate Change - Sea level rises",
        "Climate Change - Unexpected seasonal/temperature extremes",
        "Disease/pathogens - Areas that are infected",
        "Disease/pathogens - Possible infection of disease free areas",
        "Fire - Inappropriate fire regime",
        "Fire - Lack of protection for ecological assets during fire control activities",
        "Genetics - Bottleneck/inbreeding",
        "Habitat loss - Breeding place disturbance",
        "Habitat loss - Dieback/senescence",
        "Habitat loss - Feeding habitat loss/interference",
        "Habitat loss - Habitat fragmentation",
        "Habitat loss - Land clearing",
        "Habitat loss - Loss of critical ecosystem service supporting habitat",
        "Human interference - Fish and harvesting aquatic resources (commercial)",
        "Human interference - Flow-on effects of housing development",
        "Human interference - Illegal activities",
        "Human interference - Industrial development",
        "Human interference - Land use intensification",
        "Human interference - Recreational fishing",
        "Human interference - Recreational pressures",
        "Human interference - Road/vehicle strike",
        "Knowledge/Capacity - Inadequate scientific and/or technological capacity",
        "Knowledge/Capacity - Insufficient knowledge to inform appropriate management or intervention actions",
        "Land management practices - Changes to hydrology and aquatic systems",
        "Land management practices - Domestic grazing/stock impacts",
        "Land management practices - Excess recharge of groundwater",
        "Land management practices - Excess use (or over-use) of surface water or groundwater resources",
        "Land management practices - Excessive fertiliser use",
        "Land management practices - Inappropriate ground cover management",
        "Land management practices - Runoff",
        "Native fauna - Competition",
        "Native fauna - Predation",
        "Pest - Competition/exclusion",
        "Pest - Disease transmission",
        "Pest - Habitat degradation",
        "Pest - Introduction of new pest animals",
        "Pest - Predation",
        "Pollution - Chemical",
        "Pollution - Eutrophication/algal blooms",
        "Pollution - Inappropriate waste disposal",
        "Pollution - Sediment ",
        "Population size/range - Low habitat area",
        "Population size/range - Low population numbers",
        "Weeds - Competition",
        "Weeds - Introduction of new weed",
        "Weeds - Spread of weeds from surrounding areas"
    ],
    "navigationMode": "returnToProject",
    "priorityPlaces": [
        "Australian Alps – NSW/ACT/VIC",
        "Brigalow Country – QLD",
        "Bruny Island – TAS",
        "Christmas Island – External Territory",
        "Eastern Forests of Far North Queensland – QLD",
        "Fitz-Stirlings – WA",
        "French Island – VIC",
        "Giant Kelp Ecological Community – TAS",
        "Greater Blue Mountains – NSW",
        "Kakadu & West Arnhem – NT",
        "Kangaroo Island – SA",
        "MacDonnell Ranges – NT",
        "Mallee Birds Ecological Community – VIC/SA/NSW",
        "Midlands region of central Tasmanian – TAS",
        "Norfolk Island – External Territory",
        "Raine Island – Queensland",
        "Remnant WA Wheatbelt Woodlands – WA",
        "South East Coastal Ranges – NSW/VIC",
        "Southern Plains, including the Western Victorian volcanic plain and karst springs – VIC/SA",
        "Yampi Sounds and surrounds – WA"
    ],
    "supportsParatoo": true,
    "supportsMeriPlanHistory": true
};

createProgram({
    programId: "new_grants_program",
    name: "New Grants Program",
    description: "",
    config: configForGrantsProgram
});

createProject({projectId: "grants1", name: "New Grants Project", programId: "new_grants_program", plannedStartDate: ISODate("2026-06-30T14:00:00Z"), plannedEndDate: ISODate("2028-06-30T14:00:00Z")});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "grants1",
    userId: '1',
    accessLevel: 'admin'
});




