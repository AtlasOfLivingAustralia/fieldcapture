db.program.updateMany(
    {
        "config.projectReports.activityType": "Grants and Others Final Report"
    },
    {
        $set: {
            "config.projectReports.$[elem].activityType": "Non RDP Final Report"
        }
    },
    {
        arrayFilters: [
            { "elem.activityType": "Grants and Others Final Report" }
        ]
    }
)

db.program.updateMany(
    {
        "config.projectReports.activityType": "Priority Places Final Report"
    },
    {
        $set: {
            "config.projectReports.$[elem].activityType": "Non RDP Final Report"
        }
    },
    {
        arrayFilters: [
            { "elem.activityType": "Priority Places Final Report" }
        ]
    }
)

db.program.updateMany(
    {
        "config.projectReports.activityType": "Final Report"
    },
    {
        $set: {
            "config.projectReports.$[elem].activityType": "Non RDP Final Report"
        }
    },
    {
        arrayFilters: [
            { "elem.activityType": "Final Report" }
        ]
    }
)

db.program.updateMany(
    {
        "config.projectReports.activityType": "Non RDP Final Report"
    },
    {
        $set: {
            "config.projectReports.$[elem].description": ""
        }
    },
    {
        arrayFilters: [
            {
                "elem.activityType": "Non RDP Final Report",
                "elem.description": "_Please note that the reporting fields for these reports are currently being developed_"
            }
        ]
    }
)