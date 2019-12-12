var coreServicesReport = {
    "class": "au.org.ala.ecodata.ActivityForm",
    "id": "5d11c0dde4b0bea71a240ee7",
    "activationDate": null,
    "category": "RLP Reports",
    "createdUserId": "<anon>",
    "dateCreated": ISODate("2019-06-25T06:36:14Z"),
    "formVersion": 1,
    "gmsId": null,
    "lastUpdated": ISODate("2019-06-25T06:36:14Z"),
    "lastUpdatedUserId": "<anon>",
    "minOptionalSectionsCompleted": 1,
    "name": "RLP Core Services report",
    "publicationStatus": "published",
    "sections": [
        {
            "class": "au.org.ala.ecodata.FormSection",
            "id": null,
            "collapsedByDefault": false,
            "modelName": null,
            "name": "RLP Core Services report",
            "optional": false,
            "optionalQuestionText": null,
            "template": {
                "name": "RLP - Core services report",
                "title": "Core services - reporting",
                "dataModel": [
                    {
                        "name": "coreServicesRequirementsMet",
                        "dataType": "text",
                        "validate": "required",
                        "constraints": [
                            "Met Core Services requirements",
                            "Not met Core Services requirements"
                        ]
                    },
                    {
                        "name": "notMetCoreServicesRequirementsReason",
                        "dataType": "text",
                        "validate": "required",
                        "behaviour": [
                            {
                                "condition": "coreServicesRequirementsMet == \"Not met Core Services requirements\"",
                                "type": "enable"
                            }
                        ]
                    },
                    {
                        "name": "whsRequirementsMet",
                        "dataType": "text",
                        "validate": "required",
                        "constraints": [
                            "Met requirements",
                            "Not met requirements"
                        ]
                    },
                    {
                        "name": "notMetWHSRequirementsReason",
                        "dataType": "text",
                        "validate": "required",
                        "behaviour": [
                            {
                                "condition": "whsRequirementsMet == \"Not met requirements\"",
                                "type": "enable"
                            }
                        ]
                    }
                ],
                "viewModel": [
                    {
                        "type": "row",
                        "items": [
                            {
                                "css": "span6",
                                "type": "selectOne",
                                "source": "coreServicesRequirementsMet",
                                "preLabel": "Has the Service Provider delivered the Core Services in accordance with Schedule 2 – Statement of Work for this reporting period?"
                            }
                        ]
                    },
                    {
                        "type": "row",
                        "items": [
                            {
                                "type": "textarea",
                                "source": "notMetCoreServicesRequirementsReason",
                                "preLabel": "Please enter the reason(s) the Core Services requirements were not met"
                            }
                        ]
                    },
                    {
                        "type": "row",
                        "items": [
                            {
                                "css": "span6",
                                "type": "selectOne",
                                "source": "whsRequirementsMet",
                                "preLabel": "Has the Service Provider provided a safe work environment consistent with WHS Laws and in accordance with Clause 44 of the Services Agreement within this reporting period?"
                            }
                        ]
                    },
                    {
                        "type": "row",
                        "items": [
                            {
                                "type": "textarea",
                                "source": "notMetWHSRequirementsReason",
                                "preLabel": "Please enter the reason(s) the WHS requirements were not met"
                            }
                        ]
                    }
                ]
            },
            "templateName": "rlpCoreServicesReport",
            "title": "Core Services report"
        }
    ],
    "status": "active",
    "supportsPhotoPoints": false,
    "supportsSites": false,
    "type": "Report"
};
