var PhotoPoint = function(data) {
    this.name = data.name;
    this.lat = data.geometry.decimalLatitude;
    this.lon = data.geometry.decimalLongitude;
    this.bearing = data.geometry.bearing;
    this.description = data.description;
};

self.loadphotoPoints = function(data) {
    var photoPointByName = function(name, data) {
        var photoPoint;
        if (data !== undefined) {
            $.each(data, function(index, obj) {
                if (obj.name === name) {
                    photoPoint = obj;
                    return false;
                }
            });
        }
        return photoPoint;
    };
    if (site !== undefined && site.poi !== undefined) {
        $.each(site.poi, function(index, obj) {
            var photoPoint = new PhotoPoint(obj);
            var photoPointData = photoPointByName(obj.name, data);
            if (photoPointData === undefined) {
                photoPointData = {comment:"", photo:""};
            }
            var row = new PhotoPointsRow(photoPointData);
            $.extend(row, photoPoint);

            self.data.photoPoints.push(row);
        });
    }
};

self.removePhotoPoint = function(photoPoint) {
   self.data.${model.name}.remove(photoPoint);
};