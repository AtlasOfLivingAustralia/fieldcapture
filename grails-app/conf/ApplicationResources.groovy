modules = {
    app_bootstrap {
        dependsOn 'application'
        resource url: 'bootstrap/js/bootstrap.min.js'
        //resource url: 'bootstrap/css/bootstrap.css', attrs:[media:'screen,print']
        // lesscss-resources doesn't work with the resources plugin.
        resource url: 'bootstrap/less/bootstrap.less', plugin: 'fieldcapture-plugin',attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap'
        resource url: 'bootstrap/img/glyphicons-halflings-white.png'
        resource url: 'bootstrap/img/glyphicons-halflings.png'
        resource url: 'css/empty.css' , plugin: 'fieldcapture-plugin'// needed for less-resources plugin ?
    }

    app_bootstrap_responsive {
        dependsOn 'app_bootstrap'
        //resource url: '/bootstrap/css/bootstrap-responsive.min.css', attrs:[media:'screen,print']
        // lesscss-resources doesn't work with the resources plugin.
        resource url: 'bootstrap/less/responsive.less', plugin: 'fieldcapture-plugin',attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap_responsive'
        resource url: 'css/empty.css', plugin: 'fieldcapture-plugin' // needed for less-resources plugin ?
    }

}