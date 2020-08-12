var progressReport = {
    "class": "au.org.ala.ecodata.ActivityForm",
    "activationDate": null,
    "category": "Progress Reports",
    "createdUserId": "<anon>",
    "dateCreated": ISODate("2019-06-25T06:36:14Z"),
    "formVersion": 1,
    "gmsId": null,
    "lastUpdated": ISODate("2019-06-25T06:36:14Z"),
    "lastUpdatedUserId": "<anon>",
    "minOptionalSectionsCompleted": 1,
    "name": "Progress Report",
    "publicationStatus": "published",
    "sections": [{
        "class": "au.org.ala.ecodata.FormSection",
        "id": null,
        "collapsedByDefault": false,
        "modelName": null,
        "name": "Mandatory section 1",
        "optional": false,
        "optionalQuestionText": null,
        "template":
            {
                "modelName": "Mandatory section",
                "dataModel": [
                    {
                        "dataType": "number",
                        "name": "example",
                        "units": "mm"
                    }
                ],
                "viewModel": [
                    {
                        "type": "row",
                        "items": [
                            {
                                "type": "col",
                                "items": [
                                    {
                                        "type": "number",
                                        "source": "example",
                                        "preLabel": "A measurement in mm",
                                        "displayOptions": {
                                            "displayUnits": true
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            "class": "au.org.ala.ecodata.FormSection",
            "id": null,
            "collapsedByDefault": false,
            "modelName": "Output 1",
            "name": "Output 1",
            "optional": true,
            "optionalQuestionText": null,
            "template": {
                "modelName": "Output 1",
                "dataModel": [
                    {
                        "dataType": "number",
                        "name": "example",
                        "units": "mm"
                    }
                ],
                "viewModel": [
                    {
                        "type": "row",
                        "items": [
                            {
                                "type": "col",
                                "items": [
                                    {
                                        "type": "number",
                                        "source": "example",
                                        "preLabel": "A measurement in mm",
                                        "displayOptions": {
                                            "displayUnits": true
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            "class": "au.org.ala.ecodata.FormSection",
            "id": null,
            "collapsedByDefault": false,
            "modelName": null,
            "name": "Output 2",
            "optional": true,
            "optionalQuestionText": null,
            "template": {
                "modelName": "Output 2",
                "dataModel": [
                    {
                        "dataType": "number",
                        "name": "example",
                        "units": "mm"
                    }
                ],
                "viewModel": [
                    {
                        "type": "row",
                        "items": [
                            {
                                "type": "col",
                                "items": [
                                    {
                                        "type": "number",
                                        "source": "example",
                                        "preLabel": "A measurement in mm",
                                        "displayOptions": {
                                            "displayUnits": true
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}