print("This script is expected to be executed with a working directory of the project root directory");
print("Current working dir: "+pwd());
load('./test/functional/resources/data/meritHub.js');
if (!db.hub.find({urlPath:meritHub.urlPath}).hasNext()) {
    db.hub.insert(meritHub);
}
