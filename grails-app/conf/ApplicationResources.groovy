modules = {
    application {
        dependsOn 'jquery'
        resource url: "${grailsApplication.config.ala.baseURL?:'http://www.ala.org.au'}/wp-content/themes/ala2011/images/favicon.ico", attrs:[type:'ico'], disposition: 'head'
        resource url: [dir:'js', file:'html5.js', plugin: "ala-web-theme"], wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }, disposition: 'head'
        resource url: 'js/vkbeautify.0.99.00.beta.js'
        resource url: 'js/application.js'
        resource url: 'css/capture.css'
        resource url: 'js/jquery.shorten.js'
        resource url: 'js/bootbox.min.js'
    }

    bootstrap {
        // override declaration in ala-web-theme plugin
        dependsOn 'app_bootstrap_responsive'
    }

    defaultSkin {
        dependsOn 'application'
        resource url: 'css/default.skin.css'
    }

    nrmSkin {
        dependsOn 'application'
        //resource url: 'http://www.nrm.gov.au/css/screen.css'
        resource url: '/bootstrap/js/bootstrap.min.js'
        // LESS resources are processed into CSS automatically, but to trigger build you need to touch/edit the parent less file
        // TODO: pull this out to its own bundle for use by other "skins"
        resource url: '/bootstrap/less/bootstrap.less',attrs:[rel: "stylesheet/less", type:'css'], bundle:'bundle_nrmSkin'
        resource url: '/bootstrap/less/responsive.less',attrs:[rel: "stylesheet/less", type:'css'], bundle:'bundle_nrmSkin'
        resource url: 'css/nrm/css/screen.css'//, linkOverride: 'http://www.nrm.gov.au/css/screen.css'
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
        resource url: '/bootstrap/css/bootstrap.min.css'
        resource url: '/bootstrap/img/glyphicons-halflings-white.png'
        resource url: '/bootstrap/img/glyphicons-halflings.png'
    }

    app_bootstrap_responsive {
        dependsOn 'app_bootstrap'
        resource url: '/bootstrap/css/bootstrap-responsive.min.css', attrs:[media:'screen']
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
        resource 'js/jquery-autocomplete.js'
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

    jQueryImageUpload {
        dependsOn 'jquery_ui'
        resource url: 'bootstrap/css/bootstrap-responsive.min.css', attrs:[media:'screen']
        resource url: 'bootstrap/css/bootstrap-image-gallery.min.css'
        resource url: 'bootstrap/css/bootstrap-ie6.min.css',
                wrapper: { s -> "<!--[if lt IE 7]>$s<![endif]-->" }

        resource url: 'css/jquery.fileupload-ui.css', disposition: 'head'
        resource url: 'js/tmpl.min.js'
        resource url: 'js/load-image.min.js'
        resource url: 'js/canvas-to-blob.min.js'
        resource url: 'js/jquery.iframe-transport.js'
        resource url: 'js/jquery.fileupload.js'
        resource url: 'js/jquery.fileupload-fp.js'
        resource url: 'js/jquery.fileupload-ui-custom.js'
        resource url: 'js/locale.js'
        resource url: 'js/cors/jquery.xdr-transport.js',
                wrapper: { s -> "<!--[if gte IE 8]>$s<![endif]-->" }

    }
}