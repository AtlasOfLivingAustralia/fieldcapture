modules = {
    merit_projects {
        dependsOn 'projects'
        resource url:'js/meriplan.js'
        resource url:'js/risks.js'
    }

    greenArmy {
        defaultBundle 'application'
        resource 'js/greenArmyReporting.js'
    }


}