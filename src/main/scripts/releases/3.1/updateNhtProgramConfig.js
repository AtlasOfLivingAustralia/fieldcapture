load('../../utils/program.js');

let programName = "Natural Heritage Trust";
var program = db.program.findOne({name:programName});

program.config.reportData = {
    "NHT Output Report": "nhtOutputReportData"
}
db.program.replaceOne({_id:program._id}, program);

const serviceFormName = "NHT Output Report";
const annualReportFormName = "NHT Annual Report";
const outcomes1ReportFormName = "NHT Outcomes 1 Report";
const outcomes2ReportFormName = "NHT Outcomes 2 Report";
let subProgramName = "Recovery Actions for Species and Landscapes";
var subProgram = db.program.findOne({name:subProgramName});
subProgram.config = {
    "excludes": [],
    "programServiceConfig": {
    "serviceFormName": serviceFormName,
        "programServices": [
        {
            serviceId: 1,
            serviceTargetLabels: [ 'Number of baseline datasets synthesised and finalised' ]
        },
        {
            serviceId: 2,
            serviceTargetLabels: [ 'Number of communication materials published' ]
        },
        {
            serviceId: 3,
            serviceTargetLabels: [
                'Number of field days',
                'Number of training / workshop events',
                'Number of on-ground trials / demonstrations' ]
        },
        {
            serviceId: 4,
            serviceTargetLabels: [
                'Number of structures installed',
                'Area (ha) of structures installed that control access',
                'Length (km) of structures installed that control access'
            ]
        },
        {
            serviceId: 5,
            serviceTargetLabels: [
                'Area (ha) treated for pest animals - initial',
                'Area (ha) treated for pest animals - follow-up',
                'Length (km) treated for pest animals - follow-up',
                'Length (km) treated for pest animals - initial'
            ]
        },
        {
            serviceId: 7,
            serviceTargetLabels: [
                'Area (ha) of erosion control - initial',
                'Area (ha) of erosion control - follow-up',
                'Length (km) of stream/coastline treated for erosion - initial',
                'Length (km) of stream/coastline treated for erosion - follow-up'
            ]
        },
        {
            serviceId: 8,
            serviceTargetLabels: [
                'Area (ha) covered by conservation agreements established',
                'Area (ha) where implementation activities conducted (implementation/stewardship)'
            ]
        },
        {
            serviceId: 9,
            serviceTargetLabels: [
                'Number of pest animal-free enclosures - initial',
                'Number of pest animal-free enclosures - maintained',
                'Number of days maintaining pest animal-free enclosures',
                'Area (ha) of pest animal-free enclosure'
            ]
        },
        {
            serviceId: 10,
            serviceTargetLabels: [
                'Number of captive breeding and release, translocation, or re-introduction programs established',
                'Number of captive breeding and release, translocation, or re-introduction programs maintained'
            ]
        },
        {
            serviceId: 12,
            serviceTargetLabels: [
                'Number of farm management surveys conducted - baseline',
                'Number of farm management surveys conducted - indicator'
            ]
        },
        {
            serviceId: 13,
            serviceTargetLabels: [
                'Number of fauna surveys conducted - baseline',
                'Number of fauna surveys conducted - indicator'
            ]
        },
        {
            serviceId: 14,
            serviceTargetLabels: [
                'Area (ha) treated by fire management action/s - initial',
                'Area (ha) treated by fire management action/s - follow-up'
            ]
        },
        {
            serviceId: 15,
            serviceTargetLabels: [
                'Number of flora surveys conducted - baseline',
                'Number of flora surveys conducted - indicator'
            ]
        },
        {
            serviceId: 16,
            serviceTargetLabels: [
                'Area (ha) of augmentation - initial',
                'Area (ha) of augmentation - maintained',
                'Number of locations where structures installed - initial',
                'Number of locations where structures installed - maintained'
            ]
        },
        {
            serviceId: 18,
            serviceTargetLabels: [
                'Number of treatments implemented to improve site eco-hydrology - initial',
                'Number of treatments implemented to improve site eco-hydrology - follow-up'
            ]
        },
        {
            serviceId: 42,
            serviceTargetLabels: [
                'Number of habitat condition assessment surveys conducted - baseline',
                'Number of habitat condition assessment surveys conducted - indicator'
            ]
        },
        {
            serviceId: 17,
            serviceTargetLabels: [ 'Number of potential sites assessed' ]
        },
        {
            serviceId: 19,
            serviceTargetLabels: [
                'Area (ha) covered by practice change - initial',
                'Area (ha) covered by practice change - follow-up'
            ]
        },
        {
            serviceId: 20,
            serviceTargetLabels: [
                'Area (ha) for disease treatment/prevention - initial',
                'Area (ha) for disease treatment/prevention - follow-up',
                'Length (km) for disease treatment/prevention - initial',
                'Length (km) for disease treatment/prevention - follow-up'
            ]
        },
        {
            serviceId: 23,
            serviceTargetLabels: [
                'Number of pest animal surveys conducted - baseline',
                'Number of pest animal surveys conducted - indicator'
            ]
        },
        {
            serviceId: 24,
            serviceTargetLabels: [
                'Number of seed germination/plant survival surveys completed - indicator'
            ]
        },
        {
            serviceId: 26,
            serviceTargetLabels: [
                'Area (ha) of remediation of riparian/aquatic areas - initial',
                'Area (ha) of remediation of riparian/aquatic areas - follow-up',
                'Length (km) of remediation of riparian/aquatic areas - initial',
                'Length (km) of remediation of riparian/aquatic areas - follow-up',
            ]
        },
        {
            serviceId: 27, // Weed treatment
            serviceTargetLabels: [
                'Area (ha) treated for weeds - initial',
                'Area (ha) treated for weeds - follow-up',
                'Length (km) treated for weeds - initial',
                'Length (km) treated for weeds - follow-up'
            ]
        },
        {
            serviceId: 28,
            serviceTargetLabels: [
                'Area (ha) of habitat revegetated - initial',
                'Area (ha) of habitat revegetated - maintained',
            ]
        },
        {
            serviceId: 29,
            serviceTargetLabels: [
                'Number of skills and knowledge surveys conducted - baseline',
                'Number of skills and knowledge surveys conducted - indicator'
            ]
        },
        {
            serviceId: 30,
            serviceTargetLabels: [
                'Number of soil tests conducted - baseline',
                'Number of soil tests conducted - indicator',
            ]
        },
        {
            serviceId: 31,
            serviceTargetLabels: [
                'Number of interventions - initial',
                'Number of interventions - follow-up'
            ]
        },
        {
            serviceId: 32,
            serviceTargetLabels: [
                'Number of water quality surveys conducted - baseline',
                'Number of water quality surveys conducted - indicator'
            ]
        },
        {
            serviceId: 33,
            serviceTargetLabels: [
                'Number of weed distribution surveys conducted - baseline',
                'Number of weed distribution surveys conducted - indicator'
            ]
        },
        {
            serviceId: 34,
            serviceTargetLabels: [
                'Area (ha) of debris removal - initial',
                'Area (ha) of debris removal - follow-up',
                'Length (km) of debris removal - initial',
                'Length (km) of debris removal - follow-up'
            ]
        },
        {
            serviceId: 35,
            serviceTargetLabels: [
                'Area (ha) of site preparation',
                'Length (km) of site preparation'
            ]
        },
        {
            serviceId: 36,
            serviceTargetLabels: [
                'Amount (grams)/number of seeds/cuttings collected',
                'Number of days propagating',
                'Number of plants propagated'
            ]
        },
        {
            serviceId: 43,
            serviceTargetLabels: [
                'Number of FTEs invoiced for'
            ]
        },
        {
            serviceId: 44,
            serviceTargetLabels: [
                'Number of days conducting cultural practices'
            ]
        }
    ]

},
    "visibility": "private",
    "requiresActivityLocking": true,
    "projectTemplate": "rlp",
    "activityPeriodDescriptor": "Outputs report #",
    "supportsParatoo": true,
    "supportsMeriPlanComparison": true,
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
        "reportsAlignedToCalendar": true,
        "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
        "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
        "reportingPeriodInMonths": 3,
        "description": "",
        "category": "Outputs Reporting",
        "activityType": serviceFormName,
        "canSubmitDuringReportingPeriod": true,
        "label": "Quarter",
        "minimumReportDurationInDays": 1

    },
    {
        "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
        "reportType": "Administrative",
        "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
        "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
        "reportingPeriodInMonths": 12,
        "category": "Annual Progress Reporting",
        "activityType": annualReportFormName,
        "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
        "label": "Annual",
        "minimumReportDurationInDays": 1
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "minimumOwnerDurationInMonths": null,
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 36,
        "alignToOwnerStart":true,
        "alignToOwnerEnd":true,
        "multiple": false,
        "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
        "maximumOwnerDurationInMonths": 35,
        "category": "Outcomes Report 1",
        "reportsAlignedToCalendar": false,
        "activityType": outcomes1ReportFormName,
        "label":"Outcomes Report 1"
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "minimumOwnerDurationInMonths": 36,
        "maximumOwnerDurationInMonths": 47,
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 24,
        "multiple": false,
        "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
        "category": "Outcomes Report 1",
        "activityType": outcomes1ReportFormName,
        "label": "Outcomes Report 1"
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 36,
        "multiple": false,
        "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
        "minimumOwnerDurationInMonths": 48,
        "calendarAlignmentMonth": 7,
        "category": "Outcomes Report",
        "reportsAlignedToCalendar": true,
        "activityType": outcomes1ReportFormName,
        "label": "Outcomes Report 1"
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
        "minimumOwnerDurationInMonths": 36,
        "reportNameFormat": "Outcomes Report 2",
        "alignToOwnerStart":true,
        "alignToOwnerEnd":true,
        "multiple": false,
        "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
        "category": "Outcomes Report 2",
        "activityType": outcomes2ReportFormName,
        "label": "Outcomes Report 2"
    }
],
    "navigationMode": "returnToProject",
    "supportsMeriPlanHistory": true,
    "requireMeritAdminToReturnMeriPlan":true,
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
            "priorityPlaceLabel":"Does this project directly support a priority place?",
            "priorityPlaceHelpText":"Priority places recognises that some threatened species share the same habitat, and that place-based action can support protection and recovery of more than one species."
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
            "title": "Additional benefits",
            "helpTextHeading":"If the project is not delivering additional benefits, delete the row using the 'x' in the right-most column.",
            "outcomePriority":"Additional outcome/s",
            "priority":"Additional Investment Priorities",
            "priorityHelpText":"Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "outcomeType": "mid",
            "subtitle": "Medium-term outcome statement/s",
            "title": "Project Outcomes",
            "extendedOutcomes": true,
            "helpText":"Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime",
            "minimumNumberOfOutcomes": 0
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "outcomeType": "short",
            "helpText": "Outline the degree of impact having undertaken the services for up to three years. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime",
            "subtitle": "Short-term outcome statement/s",
            "extendedOutcomes": true
        }
    },
    {
        "template": "extendedKeyThreats",
        "model": {
            "title":"Key threat(s) and/or key threatening processes",
            "threatHelpText":"Describe the key threats or key threatening processes to the investment priority",
            "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
            "interventionHelpText":"Describe the proposed method to address the threat or threatening process",
            "servicesHelpText": "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables"
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words])",
            "helpText": "Include all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic."
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "helpTextPartnerName":"Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project",
            "helpTextHeading":"Note: Not limited to key subcontractors."
        }
    },
    {
        "template": "extendedBaselineMonitoring",
        "model": {
            "approachHeading": "Monitoring method",
            "indicatorHeading": "Monitoring methodology",
            "baselineDataHelpText": "Existing baseline data needs to be based on best practice methods and be compatible with the EMSA protocols.",
            "baselineDataDescriptionHelpText": "Describe the project baseline to be established, or the baseline data that currently exists",
            "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
            "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
            "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
            "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
            "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s).  Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
            "newIndicatorText": "New monitoring indicator",
            "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance"
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
            "headingTitle": "Conservation and management plans"
        }
    },
    {
        "template": "serviceOutcomeTargets",
        "model": {
            "title": "Project services and targets",
            "serviceName": "Service",
            "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
        }
    },
    {
        "template": "serviceForecasts",
        "excludedModes":["PRINT"],
        "model": {
            "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
        }
    },
    {
        "template": "attachmentRdpFooter",
        "model": {
            "heading": "MERI Attachments",
            "attachmentText": "Please attach Project logic to your MERI plan using the documents function on the Admin tab.  A \"Document type\" of \"Project Logic\" should be selected when uploading the document."
        }
    }
],
    keyThreatCodes: [
        'Climate Change - Changed flooding regime',
        'Climate Change - Changed rainfall patterns',
        'Climate Change - Sea level rises',
        'Climate Change - Unexpected seasonal/temperature extremes',
        'Disease/pathogens - Areas that are infected',
        'Disease/pathogens - Possible infection of disease free areas',
        'Fire - Inappropriate fire regime',
        'Fire - Lack of protection for ecological assets during fire control activities',
        'Genetics - Bottleneck/inbreeding',
        'Habitat loss - Breeding place disturbance',
        'Habitat loss - Dieback/senescence',
        'Habitat loss - Feeding habitat loss/interference',
        'Habitat loss - Habitat fragmentation',
        'Habitat loss - Land clearing',
        'Habitat loss - Loss of critical ecosystem service supporting habitat',
        'Human interference - Fish and harvesting aquatic resources (commercial)',
        'Human interference - Flow-on effects of housing development',
        'Human interference - Illegal activities',
        'Human interference - Industrial development',
        'Human interference - Land use intensification',
        'Human interference - Recreational fishing',
        'Human interference - Recreational pressures',
        'Human interference - Road/vehicle strike',
        'Land management practices - Changes to hydrology and aquatic systems',
        'Land management practices - Domestic grazing/stock impacts',
        'Land management practices - Excess recharge of groundwater',
        'Land management practices - Excess use (or over-use) of surface water or groundwater resources',
        'Land management practices - Excessive fertiliser use',
        'Land management practices - Inappropriate ground cover management',
        'Land management practices - Runoff',
        'Native fauna - Competition',
        'Native fauna - Predation',
        'Pest - Competition/exclusion',
        'Pest - Disease transmission',
        'Pest - Habitat degradation',
        'Pest - Introduction of new pest animals',
        'Pest - Predation',
        'Pollution - Chemical',
        'Pollution - Eutrophication/algal blooms',
        'Pollution - Inappropriate waste disposal',
        'Pollution - Sediment ',
        'Population size/range - Low habitat area',
        'Population size/range - Low population numbers',
        'Weeds - Competition',
        'Weeds - Introduction of new weed',
        'Weeds - Spread of weeds from surrounding areas'
    ],
    priorityPlaces: [
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
    ]

};

db.program.replaceOne({_id:subProgram._id}, subProgram);