load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/sites.js');


let geojson = {
    "type": "FeatureCollection",
    "name": "Fish Survey Sites WGS84",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [

        // From Fish Survey Sites1.zip
        { "type": "Feature", "properties": { "qldglobe_p": "Lake Bullawarra 22-04, 23-03, 24-05", "_labelid": "places-label-1667181038948-65", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-27.90482,143.60802", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.608023947312802, -27.904823412045815 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Autumnvale River Gauge 22-04, 23-03, 24-05", "_labelid": "places-label-1667181093486-77", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-27.76720,143.93732", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.937319338250859, -27.767200948774281 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Thargo Stn Hstd WH 23-03, 24-05", "_labelid": "places-label-1680554540942-85", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.01281,143.80427", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.804265960754321, -28.012814073759692 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Bokanda Dam 23-03, 24-05", "_labelid": "places-label-1680555001376-87", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.81280,144.58185", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.581854329056341, -28.812796987887612 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Silt Trap 23-03, 24-05", "_labelid": "places-label-1680555152168-89", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.52756,144.29507", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.295069707164572, -28.527557145102328 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Mulianna (Goat WH) 23-03, 24-05", "_labelid": "places-label-1680555316588-91", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-27.68369,144.00345", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.003452546175879, -27.683692052898891 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Yappi Ck 23-03, 24-05", "_labelid": "places-label-1680559855960-93", "_measureLa": "null", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-27.94938,143.80914", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.809142084852425, -27.949377681775101 ] } },

        // From Fish Survey Sites2.zip
        { "type": "Feature", "properties": { "qldglobe_p": "Centroid", "_labelid": "places-label-1718603581526-95", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.69230,144.49684", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.496843622199748, -28.692296113912096 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Caiwarro Woolshed WH 24-05", "_labelid": "places-label-1720231837857-97", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.72379,144.78204", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.782037218526085, -28.723787570062694 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Caiwarro WH 24-05", "_labelid": "places-label-1720236312612-99", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.73953,144.73412", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.734118758263691, -28.739529295531703 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Corni Paroo WH 24-05", "_labelid": "places-label-1720236370793-101", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.68721,144.78848", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.788475554193639, -28.687211082333409 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Ourimperee WH 24-05", "_labelid": "places-label-1720236791853-103", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.88408,144.51047", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.510469027890423, -28.884081180625504 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Carwarra Ck 24-05", "_labelid": "places-label-1720236876181-105", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.83972,144.49105", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.491050594144298, -28.839723031645882 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Werewilka Ck Xing 24-05", "_labelid": "places-label-1720236940317-107", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.57050,144.25387", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.253868338445216, -28.570504036258654 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Ephemeral Causeway 24-05", "_labelid": "places-label-1720237001855-109", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.61106,144.29962", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.299621459186284, -28.611064893187947 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Myninya WH 24-05", "_labelid": "places-label-1720237063164-111", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.54095,144.33134", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.331339181111815, -28.540948094520601 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Boorara Ck 24-05", "_labelid": "places-label-1720237159201-113", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.65694,144.38214", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.382143333426086, -28.656935073331159 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Hungerford Rd Dam 24-05", "_labelid": "places-label-1720237319854-115", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.79176,144.59253", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 144.592528329531319, -28.791764516147506 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Koolkurry WH 24-05", "_labelid": "places-label-1720238153137-117", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.06160,143.77550", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.775496236239263, -28.061601096566207 ] } },
        { "type": "Feature", "properties": { "qldglobe_p": "Old Thargo Rd Xing 24-05", "_labelid": "places-label-1720238237396-119", "_measureLa": "null", "elevation": "on-the-ground", "coordinate": "GDA2020 lat/lng", "Lat/Long": "-28.01251,143.78617", "symbolType": null }, "geometry": { "type": "Point", "coordinates": [ 143.786166869656512, -28.012512047237554 ] } }


    ]
};



let adminUserId = '<TBA>';
let projectId = 'f54be245-3914-4a35-909e-0d4b4613bb32';
for (var i=0; i<geojson.features.length; i++) {
    let site = featureToSite(geojson.features[i], 'qldglobe_p',  i, projectId);

    db.site.insert(site);
    print("Created site with id: "+site.siteId);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId, projectId, 'insert');
}