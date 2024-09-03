
function featureToSite(feature, nameProperty, counter, projectId) {

    let name = feature.properties[nameProperty];
    if (!name) {
        name = 'Site '+counter;
    }

    let date = new ISODate();
    let isPoint = feature.geometry.type == 'Point';
    let source =  isPoint ? 'point' : 'drawn';
    let site = {
        siteId: UUID.generate(),
        name: name,
        description:"Imported on "+date.toString(),
        notes: '',
        extent: {
            geometry: feature.geometry,
            source:source
        },
        projects: [projectId],
        status:'active',
        dateCreated:date,
        lastUpdated:date,
        type:'worksArea',

    };
    if (isPoint) {
        site.extent.geometry.decimalLatitude = feature.geometry.coordinates[1];
        site.extent.geometry.decimalLongitude = feature.geometry.coordinates[0];
    }
    return site;
};