load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/sites.js');


let geojsons = [{ "type": "Feature", "properties": { "id": 1 }, "geometry": { "type": "Point", "coordinates": [ 147.0732759, -42.774629 ] } },
    { "type": "Feature", "properties": { "id": 2 }, "geometry": { "type": "Point", "coordinates": [ 147.0261391, -42.8601336 ] } },
    { "type": "Feature", "properties": { "id": 3 }, "geometry": { "type": "Point", "coordinates": [ 147.26271, -42.7448527 ] } },
    { "type": "Feature", "properties": { "id": 4 }, "geometry": { "type": "Point", "coordinates": [ 147.3023904, -42.7426108 ] } },
    { "type": "Feature", "properties": { "id": 5 }, "geometry": { "type": "Point", "coordinates": [ 147.2808581, -42.7580204 ] } },
    { "type": "Feature", "properties": { "id": 6 }, "geometry": { "type": "Point", "coordinates": [ 147.2617735, -42.7294574 ] } },
    { "type": "Feature", "properties": { "id": 7 }, "geometry": { "type": "Point", "coordinates": [ 147.2659593, -42.7017102 ] } },
    { "type": "Feature", "properties": { "id": 8 }, "geometry": { "type": "Point", "coordinates": [ 147.2404825, -42.7646539 ] } },
    { "type": "Feature", "properties": { "id": 9 }, "geometry": { "type": "Point", "coordinates": [ 147.2572968, -42.7951183 ] } },
    { "type": "Feature", "properties": { "id": 10 }, "geometry": { "type": "Point", "coordinates": [ 147.2758706, -42.8275054 ] } },
    { "type": "Feature", "properties": { "id": 11 }, "geometry": { "type": "Point", "coordinates": [ 147.251089, -42.8485055 ] } },
    { "type": "Feature", "properties": { "id": 12 }, "geometry": { "type": "Point", "coordinates": [ 147.3042527, -42.8341885 ] } },
    { "type": "Feature", "properties": { "id": 13 }, "geometry": { "type": "Point", "coordinates": [ 147.3023265, -42.8500344 ] } },
    { "type": "Feature", "properties": { "id": 14 }, "geometry": { "type": "Point", "coordinates": [ 147.2684567, -42.8678207 ] } },
    { "type": "Feature", "properties": { "id": 15 }, "geometry": { "type": "Point", "coordinates": [ 147.3311698, -42.8803002 ] } },
    { "type": "Feature", "properties": { "id": 16 }, "geometry": { "type": "Point", "coordinates": [ 147.297793, -42.8950641 ] } },
    { "type": "Feature", "properties": { "id": 17 }, "geometry": { "type": "Point", "coordinates": [ 147.3255863, -42.8934217 ] } },
    { "type": "Feature", "properties": { "id": 18 }, "geometry": { "type": "Point", "coordinates": [ 147.2969629, -42.9055465 ] } },
    { "type": "Feature", "properties": { "id": 19 }, "geometry": { "type": "Point", "coordinates": [ 147.3153806, -42.975528 ] } },
    { "type": "Feature", "properties": { "id": 20 }, "geometry": { "type": "Point", "coordinates": [ 147.2826885, -42.9852903 ] } },
    { "type": "Feature", "properties": { "id": 21 }, "geometry": { "type": "Point", "coordinates": [ 147.443368, -42.899814 ] } },
    { "type": "Feature", "properties": { "id": 22 }, "geometry": { "type": "Point", "coordinates": [ 147.4367842, -42.8874409 ] } },
    { "type": "Feature", "properties": { "id": 23 }, "geometry": { "type": "Point", "coordinates": [ 147.3688459, -42.8640002 ] } },
    { "type": "Feature", "properties": { "id": 24 }, "geometry": { "type": "Point", "coordinates": [ 147.3920028, -42.8545218 ] } },
    { "type": "Feature", "properties": { "id": 25 }, "geometry": { "type": "Point", "coordinates": [ 147.3449511, -42.8370831 ] } },
    { "type": "Feature", "properties": { "id": 26 }, "geometry": { "type": "Point", "coordinates": [ 147.3238658, -42.815934 ] } },
    { "type": "Feature", "properties": { "id": 27 }, "geometry": { "type": "Point", "coordinates": [ 147.3345859, -42.8128549 ] } },
    { "type": "Feature", "properties": { "id": 28 }, "geometry": { "type": "Point", "coordinates": [ 147.3785727, -42.8554795 ] } },
    { "type": "Feature", "properties": { "id": 29 }, "geometry": { "type": "Point", "coordinates": [ 147.4274973, -42.8773381 ] } },
    { "type": "Feature", "properties": { "id": 30 }, "geometry": { "type": "Point", "coordinates": [ 147.3016454, -42.9700155 ] } },
    { "type": "Feature", "properties": { "id": 31 }, "geometry": { "type": "Point", "coordinates": [ 147.2970765, -42.9717466 ] } },
    { "type": "Feature", "properties": { "id": 32 }, "geometry": { "type": "Point", "coordinates": [ 147.2994177, -42.9729314 ] } }];



let adminUserId = '4228';
let projectId = 'b4d8e001-352d-47e7-ae3f-27e891779996';
let sites = []
for (var i=0; i<geojsons.length; i++) {
    let site = featureToSite(geojsons[i], 'site', "00" + i, projectId);

    db.site.insert(site);
    sites.push(site.siteId);
    print("Created site with id: "+site.siteId);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId, projectId, 'insert');
}

print(JSON.stringify(sites));