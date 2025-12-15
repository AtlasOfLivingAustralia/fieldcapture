let monitorRoleMapping = {
    "authenticated": {
        "read": {
            "plot-selection-guid": true,
            "guid-1": true,
            "guid-2": true,
            "guid-3": true,
            "guid-4": true,
            "determinations": true
        },
        "write": {
            "plot-selection-guid": false,
            "guid-1": true,
            "guid-2": true,
            "guid-3": true,
            "guid-4": true,
            "determinations": false
        }
    },
    "project_admin": {
        "read": {
            "plot-selection-guid": true,
            "guid-1": true,
            "guid-2": true,
            "guid-3": true,
            "guid-4": true,
            "determinations": false
        },
        "write": {
            "plot-selection-guid": true,
            "guid-1": true,
            "guid-2": true,
            "guid-3": true,
            "guid-4": true,
            "determinations": false
        }
    },
    "determiner": {
        "read": {
            "plot-selection-guid": true,
            "guid-1": false,
            "guid-2": false,
            "guid-3": false,
            "guid-4": false,
            "determinations": true
        },
        "write": {
            "plot-selection-guid": false,
            "guid-1": false,
            "guid-2": false,
            "guid-3": false,
            "guid-4": false,
            "determinations": true
        }
    }
};

db.setting.insertOne({key:'paratoo.roleProtocol.mapping', value: JSON.stringify(monitorRoleMapping),  updatedAt: new Date(), dateCreated: new Date()});