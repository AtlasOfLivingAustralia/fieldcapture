load('../../../utils/program.js');
load('../../../utils/audit.js');
load('../../../utils/uuid.js');
const programToCopy = 'Bush Blitz'; // Fairly new grants program as a template
const programName = 'Example Grants Program';
let program = db.program.findOne({name:programName});
if (!program) {
    program = createProgramAsCopy(programName, programToCopy);
}

program.config.meriPlanContents = [
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
            "outcomeType": "mid",
            "helpText": "Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime",
            "minimumNumberOfOutcomes": 0,
            "subtitle": "Medium-term outcome statement/s",
            "title": "Project Outcomes",
            "extendedOutcomes": true
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
            "threatsHeading":"Key threats/barriers/issues the project is addressing",
            "descriptionHeading":"How have these threats or barriers impacted the investment priority",
            "methodologyHeading": "How will you carry out the activities to support this?",
            "title": "Threats, Barriers and Issues"
        }
    },
    {
        "template": "extendedBaselineMonitoring",
        "model": {
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
            "newIndicatorText": "New monitoring indicator",
            "numberOfMandatoryRows": 0
        }
    },
    {
        "template": "serviceOutcomeTargets",
        "model": {
            "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections",
            "title": "Project services and targets",
            "serviceName": "Service"
        }
    },
    {
        "template": "serviceForecasts",
        "model": {
            "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
        },
        "excludedModes": [
            "PRINT"
        ]
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
];
program.config.targetsConfig = {
    "periodGenerationConfig": {
        "reportType": "Targets",
        "reportDescriptionFormat": "Target period %d for %4$s",
        "reportNameFormat": "Target period %d",
        "reportingPeriodInMonths": 6,
        "minimumReportDurationInDays": 1,
        "label": "6 monthly",
        "category": "Targets",
        "activityType": "Regional Capacity Services Report"
    },
    "periodLabelFormat": "MMM YYYY"
};
db.program.replaceOne({programId:program.programId}, program);