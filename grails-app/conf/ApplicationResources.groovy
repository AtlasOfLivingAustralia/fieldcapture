modules = {

    application {
        dependsOn 'jquery,knockout'
        resource url: "${grailsApplication.config.ala.baseURL?:'http://www.ala.org.au'}/wp-content/themes/ala2011/images/favicon.ico", attrs:[type:'ico'], disposition: 'head'
        resource url: 'js/html5.js', wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }, disposition: 'head'
        resource url: 'js/vkbeautify.0.99.00.beta.js'
        resource url: 'js/fieldcapture-application.js'
        resource url: 'js/jquery.shorten.js'
        resource url: 'js/bootbox.min.js'
        resource url: 'js/jquery.columnizer.js'
        resource url: 'js/jquery.blockUI.js'
        resource url: 'js/pagination.js'
        resource url: 'css/common.css'
        resource url: 'vendor/underscorejs/1.8.3/underscore-min.js'
        resource url:'vendor/momentjs/moment.min.js'
        resource url:'vendor/momentjs/moment-timezone-with-data.min.js'
    }

    defaultSkin {
        dependsOn 'application'
        resource url: 'css/default.skin.css'
    }

    nrmSkin {
        dependsOn 'application,app_bootstrap_responsive'
        resource url: [dir:'css/nrm/css', file:'screen.css'], attrs:[media:'screen,print']
        resource url: [dir:'css/', file:'capture.css']
        resource url: [dir:'css/nrm/images/', file:'AustGovt_inline_white_on_transparent.png']
    }

    wmd {
        resource url:[ dir:'vendor/wmd', file:"wmd.css"]
        resource url:[ dir:'vendor/wmd', file:"showdown.js"]
        resource url:[ dir:'vendor/wmd', file:"wmd.js"]
        resource url:[ dir:'vendor/wmd', file:'wmd-buttons.png']

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
        resource url:'vendor/knockout/3.4.0/knockout-3.4.0.js'
        resource url:'js/knockout.mapping-latest.js'
        resource url:'js/knockout-custom-bindings.js'
        resource url:'js/knockout-dates.js'
        resource url:'js/outputs.js'
        resource url:'vendor/knockout-repeat/2.1/knockout-repeat.js'
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
        resource url: 'vendor/bootstrap-datepicker/js/bootstrap-datepicker.js'
        resource url: 'vendor/bootstrap-datepicker/css/datepicker.css'
    }

    app_bootstrap {
        dependsOn 'application', 'font-awesome-44'
        resource url: 'bootstrap/js/bootstrap.min.js'
        // The less css resources plugin (1.3.3, resources plugin 1.2.14) is unable to resolve less files in a plugin so apps that use this plugin must supply their own bootstrap styles.
        // However, commenting this section
        resource url: [dir:'bootstrap/less/', file:'bootstrap.less'],attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap'
        resource url: 'bootstrap/img/glyphicons-halflings-white.png'
        resource url: 'bootstrap/img/glyphicons-halflings.png'
        resource url: 'css/empty.css' // needed for less-resources plugin ?
        resource url: 'js/bootstrap-combobox.js'
        resource url: 'css/bootstrap-combobox.css'
        resource url: 'css/typeahead.css'
        resource url: 'vendor/select2/4.0.3/js/select2.full.js'
        resource url: 'vendor/select2/4.0.3/css/select2.css'
    }

    app_bootstrap_responsive {
        dependsOn 'app_bootstrap'
        resource url: 'bootstrap/less/responsive.less',attrs:[rel: "stylesheet/less", type:'css', media:'screen,print'], bundle:'bundle_app_bootstrap_responsive'
        resource url: 'css/empty.css' // needed for less-resources plugin ?
    }

    amplify {
        defaultBundle 'application'
        resource url: 'js/amplify.min.js'
    }

    jstimezonedetect {
        resource url:'js/jstz.min.js'
    }

    js_iso8601 {
        resource url:'js/js-iso8601.min.js'
    }

    jquery_ui {
        dependsOn 'jquery'
        resource url:'js/jquery-ui-1.9.2.custom.min.js'
        resource url:'css/smoothness/jquery-ui-1.9.2.custom.min.css'
        resource url:'css/jquery-autocomplete.css'
        resource url:'js/jquery.appear.js'
    }

    jquery_bootstrap_datatable {
        resource url:'vendor/datatables/1.10.13/datatables.1.10.13.min.js'
        resource url:'js/jquery.dataTables.bootstrap.js'
        resource url:'vendor/datatables/buttons/1.2.4/datatables.buttons.min.js'
        resource url:'vendor/datatables/buttons/1.2.4/buttons.html5.min.js'
        resource url:'vendor/datatables/buttons/1.2.4/buttons.html5.min.css'
        resource url:'vendor/pdfmake/0.1.18/pdfmake.min.js'
        resource url:'vendor/pdfmake/0.1.18/vfs_fonts.js'
        resource url:'vendor/jszip/2.5.0/jszip.min.js'
        resource url:'css/dataTables.bootstrap.css'
        resource url:'images/sort_asc.png'
        resource url:[dir:'images', file:'sort_asc_disabled.png']
        resource url:[dir:'images', file:'sort_both.png']
        resource url:[dir:'images', file:'sort_desc.png']
        resource url:[dir:'images', file:'sort_desc_disabled.png']

    }

    drawmap {
        defaultBundle true
        resource url:'js/keydragzoom.js'
        resource url:'js/wms.js'
        resource url:'js/selection-map.js'
    }

    jQueryFileUpload {
        dependsOn 'jquery_ui'
        resource url: 'css/jquery.fileupload-ui.css', disposition: 'head'

        resource url: 'vendor/fileupload-9.0.0/load-image.min.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-process.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-image.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-video.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-validate.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-audio.js'
        resource url: 'vendor/fileupload-9.0.0/jquery.iframe-transport.js'

        resource url: 'js/locale.js'
        resource url: 'vendor/cors/jquery.xdr-transport.js',
                wrapper: { s -> "<!--[if gte IE 8]>$s<![endif]-->" }
    }

    jQueryFileUploadUI {
        dependsOn 'jQueryFileUpload'

        resource url: 'vendor/fileupload-9.0.0/jquery.fileupload-ui.js'
        resource url: 'vendor/fileupload-9.0.0/tmpl.js'

    }
    jQueryFileDownload{
        resource url: 'js/jQuery.fileDownload.js'
    }

    attachDocuments {
        defaultBundle 'application'
        dependsOn 'jQueryFileUpload'
        resource url: 'js/document.js'
    }

    activity {
        defaultBundle 'application'
        dependsOn 'knockout'
        resource url:'vendor/expr-eval/1.0/parser.js'
        resource url:'js/outputs.js'
        resource url:'js/activity.js'
        resource url:'js/projectActivityPlan.js'
        resource url:'css/activity.css'
    }

    jqueryGantt {
        resource url:[dir:'vendor/jquery-gantt/css/', file:'style.css']
        resource url:'css/gantt.css'
        resource url:[dir:'vendor/jquery-gantt/js/', file:'jquery.fn.gantt.js']
        resource url:[dir:'vendor/jquery-gantt/img/', file:'grid.png']
        resource url:[dir:'vendor/jquery-gantt/img/', file:'icon_sprite.png']
        resource url:[dir:'vendor/jquery-gantt/img/', file:'slider_handle.png']

    }

    projects {
        defaultBundle 'application'
        dependsOn 'knockout','attachDocuments','wmd'
        resource url:'js/projects.js'
        resource url:'js/sites.js'
    }

    siteUpload {
        resource url:'js/site-upload.js'
    }

    jquery_cookie {
        defaultBundle 'application'
        dependsOn 'jquery'
        resource url:'js/jquery.cookie.js'
    }

    projectActivity {
        defaultBundle 'application'
        dependsOn 'knockout'
        resource url:'js/projectActivity.js'
    }

    species {
        dependsOn 'knockout','app_bootstrap'
        resource url:'vendor/typeahead/0.11.1/bloodhound.min.js'
        resource url:'js/speciesModel.js'

    }

    imageViewer {
        dependsOn 'viewer', 'jquery'
        resource 'vendor/fancybox/jquery.fancybox.js'
        resource 'vendor/fancybox/jquery.fancybox.css?v=2.1.5'
        resource url:'vendor/fancybox/fancybox_overlay.png'
        resource url:'vendor/fancybox/fancybox_sprite.png'
        resource url:'vendor/fancybox/fancybox_sprite@2x.png'
        resource url:'vendor/fancybox/blank.gif'
        resource url:'vendor/fancybox/fancybox_loading@2x.gif'
        resource url: 'vendor/thumbnail.scroller/2.0.3/jquery.mThumbnailScroller.css'
        resource url: 'vendor/thumbnail.scroller/2.0.3/jquery.mThumbnailScroller.js'
    }

    fuelux {
        dependsOn 'app_bootstrap_responsive'
        resource 'vendor/fuelux/js/fuelux.min.js'
        resource 'vendor/fuelux/css/fuelux.min.css'

    }

    fuseSearch {
        dependsOn 'jquery'
        resource url: 'js/fuse.min.js'
    }

    wizard {
        dependsOn 'app_bootstrap_responsive'
        resource 'vendor/fuelux/js/wizard.js'
        resource 'vendor/fuelux/css/fuelux.min.css'
    }

    organisation {
        defaultBundle 'application'
        dependsOn 'jquery', 'knockout','wmd'
        resource 'js/organisation.js'
    }

    slickgrid {
        dependsOn 'jquery', 'jquery_ui'
        resource 'vendor/slickgrid/slick.grid.css'
        //resource 'slickgrid/slick-default-theme.css'
        //resource 'slickgrid/css/smoothness/jquery-ui-1.8.16.custom.css'
        //resource 'slickgrid/examples.css'

        resource 'vendor/slickgrid/lib/jquery.event.drag-2.2.js'
        resource 'vendor/slickgrid/lib/jquery.event.drop-2.2.js'

        resource 'vendor/slickgrid/slick.core.js'
        resource 'vendor/slickgrid/slick.dataview.js'
        //resource 'slickgrid/plugins/slick.cellcopymanager.js'
        //resource 'slickgrid/plugins/slick.cellrangedecorator.js'
        //resource 'slickgrid/plugins/slick.cellrangeselector.js'
        //resource 'slickgrid/plugins/slick.cellselectionmodel.js'


        resource 'vendor/slickgrid/slick.formatters.js'
        resource 'vendor/slickgrid/slick.editors.js'

        resource 'vendor/slickgrid/slick.grid.js'

        resource 'js/slickgrid.support.js'

        resource url:'vendor/slickgrid/images/header-columns-bg.gif'
        resource url:'vendor/slickgrid/images/header-columns-over-bg.gif'


    }

    pretty_text_diff{
        resource url: 'vendor/prettytextdiff/jquery.pretty-text-diff.min.js'
        resource url: 'vendor/prettytextdiff/diff_match_patch.js'
        resource url: 'vendor/prettytextdiff/pretty_text_diff_basic.css'
    }

    sliderpro {
        dependsOn 'jquery'
        resource url: 'vendor/slider-pro-master/js/jquery.sliderPro.min.js'
        resource url: 'vendor/slider-pro-master/css/slider-pro.min.css'
        resource url: 'vendor/slider-pro-master/css/images/blank.gif'
    }

    leaflet {
        resource url: 'vendor/leaflet/0.7.3/leaflet.js'
        resource url: 'vendor/leaflet/0.7.3/leaflet.css'
    }

    'font-awesome-44' {
        resource url: 'vendor/font-awesome/4.4.0/css/font-awesome.min.css', attrs:[media:'all']
    }

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

    reports {
        dependsOn 'application', 'newSkin'
        resource url:'css/reef2050DashboardReport.css'
    }


}