function Circle (lat,lon,radius) {
    var self = this;
    self.type = 'circle';
    self.radius = radius;
    self.decimalLatitude = lat;
    self.decimalLongitude = lon;
}

//supply wkt and coordinates for now
function Polygon (wkt, geojson) {
    var self = this;
    self.type = 'polygon';
    self.wkt = wkt;
    self.geojson = geojson;
}

function Rectangle (minLat,minLon,maxLat,maxLon) {
    var self = this;
    self.type = 'rectangle';
    self.minLat = minLat;
    self.minLon = minLon;
    self.maxLat = maxLat;
    self.maxLon = maxLon;
}