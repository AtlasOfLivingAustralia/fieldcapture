load('../data/meritHub.js');
if (!db.hub.find({urlPath:meritHub.urlPath}).hasNext()) {
    db.hub.insert(meritHub);
}