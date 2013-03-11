/*
* Handles the front page map that shows all projects.
*/

$(window).load(function () {
    // create the map and draw initial objects
    $("#map").gmap3({
        map: {
            options: {
                zoom: 4,
                center: [-28.5, 133.5],
                panControl: false,
                streetViewControl: false,
                zoomControlOptions: {
                    style: 'DEFAULT'
                }
            },
            callback: function () {
                var map = $("#map").gmap3("get");
                // initialise map overlays
                projectOverlays.init(map);
                // enable zoom by dragging while holding shift
                map.enableKeyDragZoom();
            }
        }
    });
    // wire accordion to map
    $('.accordion-group').on('show', function () {
        projectOverlays.highlightRegion($(this).attr('data-region'));
    });
    $('.accordion-group').on('hide', function () {
        projectOverlays.unHighlightRegion($(this).attr('data-region'));
    });
});

var projectOverlays = {
    map: null,  // initialised after the map is created
    list: {}, // all the project overlays
    init: function (map) {
        this.map = map;
        this.addRegion('ger_border_ranges');
        this.addRegion('ger_slopes_to_summit');
        this.addRegion('ger_kosciuszko_to_coast');
    },
    addRegion: function (name) {
        var overlay = this.createOverlay(name, false);
        this.list[name] = {idx: this.map.overlayMapTypes.push(overlay) - 1, overlay: overlay};
    },
    highlightRegion: function (name) {
        var ovObj = this.list[name], map = this.map, overlay, that = this;
        if (ovObj) {
            if (ovObj.hlOverlay === undefined) {
                ovObj.hlOverlay = that.createOverlay(name, true);
            }
            map.overlayMapTypes.setAt(ovObj.idx, ovObj.hlOverlay);
        }
    },
    unHighlightRegion: function (name) {
        var ovObj = this.list[name], map = this.map, overlay, that = this;
        if (ovObj) {
            map.overlayMapTypes.setAt(ovObj.idx, ovObj.overlay);
        }
    },
    createOverlay: function (name, highlight) {
        //
        var layerParams = [
                "format=image/png",
                "layers=ALA:" + name,
                highlight ? "sld=" + fcConfig.sldPolgonHighlightUrl : "sld=" + fcConfig.sldPolgonDefaultUrl,
                "styles="//polygon"
            ];
        return new WMSTileLayer(name,
                fcConfig.spatialWmsUrl,
                layerParams,
                function () {},
                0.6);
    }

};
