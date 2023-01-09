import shp from 'shpjs';
import bootbox from 'bootbox';
import {coordEach} from "@turf/meta";

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import {modal} from "gradle/bootstrap/js/bootstrap";
import ko from "gradle/knockout/knockout-latest";

let ViewModel = function() {
    const self = this;
    const MAX_SIZE = '2000000';
    const map = createMap({
        useAlaMap:true,
        mapContainerId:'map',
        useGoogleBaseMap:fcConfig.useGoogleBaseMap,
        featureServiceUrl: fcConfig.featureService,
        wmsServerUrl: fcConfig.spatialWmsUrl
    });

    function readFile(file) {
        const result = $.Deferred();
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            let res = reader.result;
            shp(res).then(function(geoJson) {
                result.resolve(geoJson);
            });
        });
        reader.readAsArrayBuffer(file);
        return result;
    }

    self.shapes = ko.observableArray([]);

    self.fileAttached = function(data, e) {

        const [file] = e.target.files;
        if (file) {
            const name = file.name;
            if (file.size > MAX_SIZE) {
                bootbox.alert("Size: "+file.size+" is too big!");
            }
            else {
                readFile(file).then(function(geoJson) {

                    map.featureLayer.on('layeradd', function(e) {
                        const layer = e.layer;
                        const feature = e.layer.feature;
                        const name = feature && feature.properties && feature.properties.name;
                        let coordCount = 0;
                        coordEach(feature, function() { coordCount++ });
                        const shape = {name:ko.observable(name), feature:feature, size:coordCount};
                        self.shapes.push(shape);
                    });
                    map.addFeature(geoJson);
                })
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const vm = new ViewModel();
    ko.applyBindings(vm);
});
