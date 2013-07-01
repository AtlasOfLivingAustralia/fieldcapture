function Circle (lat,lon,radius,area) {
    var self = this;
    self.type = 'circle';
    self.radius = radius;
    self.decimalLatitude = lat;
    self.decimalLongitude = lon;
    self.area = area;
}

//supply wkt and coordinates for now
function Polygon (wkt, geojson, area,centreLat,centreLng) {
    var self = this;
    self.type = 'polygon';
    self.wkt = wkt;
    self.geojson = geojson;
    self.area = area;
    self.centreLat = centreLat;
    self.centreLng = centreLng;
}

function Rectangle (minLat,minLon,maxLat,maxLon,area,centreLat,centreLng) {
    var self = this;
    self.type = 'rectangle';
    self.minLat = minLat;
    self.minLon = minLon;
    self.maxLat = maxLat;
    self.maxLon = maxLon;
    self.area = area;
    self.centreLat = centreLat;
    self.centreLng = centreLng;
}

function GazInfo (locality,state,lga){
    var self = this;
    self.locality = locality;
    self.state = state;
    self.lga = lga;
}