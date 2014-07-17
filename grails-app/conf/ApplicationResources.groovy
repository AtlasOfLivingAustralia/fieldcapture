modules = {
    application {
        dependsOn 'jquery'
        resource url: "${grailsApplication.config.ala.baseURL?:'http://www.ala.org.au'}/wp-content/themes/ala2011/images/favicon.ico", attrs:[type:'ico'], disposition: 'head'
        resource url: [dir:'js', file:'html5.js', plugin: "ala-web-theme"], wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }, disposition: 'head'
        resource url: 'js/vkbeautify.0.99.00.beta.js'
        resource url: 'js/application.js'
        resource url: 'js/jquery.shorten.js'
        resource url: 'js/bootbox.min.js'
        resource url: 'js/jquery.columnizer.js'
        resource url: 'js/jquery.blockUI.js'
    }

    bootstrap {
        // override declaration in ala-web-theme plugin, so BS code (CSS, JS) is not duplicated as app already has its own version
        dependsOn 'app_bootstrap_responsive'
    }

    defaultSkin {
        dependsOn 'application'
        resource url: 'css/default.skin.css'
    }

    nrmSkin {
        dependsOn 'application,bootstrap'
        resource url: 'css/nrm/css/screen.css', attrs:[media:'screen,print']
        resource url: 'css/capture.css'
    }

    nrmPrintSkin {
        dependsOn 'nrmSkin'
        resource url: 'css/print.css', attrs:[media:'screen,print']
    }

    gmap3 {
        resource url: 'js/gmap3.min.js'
    }

    projectsMap {
        resource url: 'js/projects-map.js'
        resource url: 'js/wms.js'
        resource url: 'js/keydragzoom.js'
    }

    mapWithFeatures {
        resource url: 'js/wms.js'
        resource url: 'js/mapWithFeatures.js'
    }

    knockout {
        resource url:'js/knockout-2.2.1.debug.js'
        resource url:'js/knockout.mapping-latest.js'
        resource url:'js/knockout-dates.js'
        resource url:'js/outputs.js'
    }

    knockout_sortable {
        dependsOn 'knockout'
        resource url:'js/knockout-sortable.min.js'
    }

    jqueryValidationEngine {
        resource url: 'js/jquery.validationEngine.js'
        resource url: 'js/jquery.validationEngine-en.js'
        resource url: 'css/validationEngine.jquery.css'
    }

    datepicker {
        resource url: 'bootstrap-datepicker/js/bootstrap-datepicker.js'
        resource url: 'bootstrap-datepicker/css/datepicker.css'
    }

    app_bootstrap {
        dependsOn 'application'
        resource url: '/bootstrap/js/bootstrap.min.js'
        //resource url: '/bootstrap/css/bootstrap.css', attrs:[media:'screen,print']
        resource url: 'bootstrap/less/bootstrap.less',attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap'
        resource url: '/bootstrap/img/glyphicons-halflings-white.png'
        resource url: '/bootstrap/img/glyphicons-halflings.png'
        resource url: 'css/empty.css' // needed for less-resources plugin ?
    }

    app_bootstrap_responsive {
        dependsOn 'app_bootstrap'
        //resource url: '/bootstrap/css/bootstrap-responsive.min.css', attrs:[media:'screen,print']
        resource url: 'bootstrap/less/responsive.less',attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap_responsive'
        resource url: 'css/empty.css' // needed for less-resources plugin ?
    }

    bootstrap_combo {
        resource url: '/js/bootstrap-combobox.js'
        resource url: '/css/bootstrap-combobox.css'
    }

    amplify {
        resource url: '/js/amplify.min.js'
    }

    jstimezonedetect {
        resource 'js/jstz.min.js'
    }

    js_iso8601 {
        resource 'js/js-iso8601.min.js'
    }

    jquery_ui {
        resource 'js/jquery-ui-1.9.2.custom.min.js'
        resource 'css/smoothness/jquery-ui-1.9.2.custom.min.css'
        resource 'css/jquery-autocomplete.css'

    }

    jquery_bootstrap_datatable {
        resource 'js/jquery.dataTables.js'
        resource 'js/jquery.dataTables.bootstrap.js'
    }

    drawmap {
        defaultBundle true
        resource 'js/keydragzoom.js'
        resource 'js/wms.js'
        resource 'js/selection-map.js'
    }

    jQueryFileUpload {
        dependsOn 'jquery_ui'
        resource url: 'js/fileupload-9.0.0/tmpl.js'
        resource url: 'bootstrap/css/bootstrap-responsive.min.css', attrs:[media:'screen']
        resource url: 'bootstrap/css/bootstrap-image-gallery.min.css'
        resource url: 'bootstrap/css/bootstrap-ie6.min.css',
                wrapper: { s -> "<!--[if lt IE 7]>$s<![endif]-->" }

        resource url: 'css/jquery.fileupload-ui.css', disposition: 'head'
        resource url: 'js/fileupload-9.0.0/load-image.min.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-process.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-image.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-video.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-validate.js'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-audio.js'
        resource url: 'js/fileupload-9.0.0/jquery.iframe-transport.js'

        resource url: 'js/locale.js'
        resource url: 'js/cors/jquery.xdr-transport.js',
                wrapper: { s -> "<!--[if gte IE 8]>$s<![endif]-->" }
    }

    jQueryFileUploadUI {
        dependsOn 'jQueryFileUpload'
        resource url: 'js/fileupload-9.0.0/jquery.fileupload-ui.js'
    }

    attachDocuments {
        dependsOn 'jQueryFileUpload'
        resource url: 'js/document.js'
    }

    fuelux {
        resource 'bootstrap/bootstrap-fuelux/fuelux.css'
        resource 'bootstrap/bootstrap-fuelux/fuelux-responsive.css'
    }

    jqueryGantt {
        resource 'jquery-gantt/css/style.css'
        resource 'css/gantt.css'
        resource 'jquery-gantt/js/jquery.fn.gantt.js'
    }

    projects {
        defaultBundle false
        dependsOn 'knockout'
        resource 'js/projects.js'
        resource 'js/moment.min.js'
    }

    jquery_cookie {
        dependsOn 'jquery'
        resource 'js/jquery.cookie.js'
    }

    species {
        dependsOn 'knockout'
        resource 'js/speciesModel.js'
    }
}