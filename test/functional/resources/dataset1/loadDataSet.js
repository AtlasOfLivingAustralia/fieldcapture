print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data/meritHub.js');
if (!db.hub.find({urlPath:meritHub.urlPath}).hasNext()) {
    db.hub.insert(meritHub);
}
