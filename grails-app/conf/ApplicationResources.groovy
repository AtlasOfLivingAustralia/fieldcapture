modules = {
    merit_projects {
        dependsOn 'projects'
        resource url:'js/meriplan.js'
        resource url:'js/risks.js'
        resource url:'css/project.css'
    }

    greenArmy {
        defaultBundle 'application'
        resource 'js/greenArmyReporting.js'
    }


    merit_admin {
        dependsOn 'application'
        resource url: 'js/admin.js'
    }

    newSkin {
        dependsOn 'nrmSkin'
        resource url: 'css/global-styles.css', attrs:[media:'screen,print']
    }

    homepage {
        dependsOn 'application', 'newSkin'
        resource url:'css/homepage.css'
        resource url:'css/project-explorer.css'
    }


}