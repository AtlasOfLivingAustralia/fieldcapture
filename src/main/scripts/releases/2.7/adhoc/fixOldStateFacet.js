const misSpelling = 'Australian Captial Territory';
const correctSpelling = 'Australian Capital Territory';

let sites = db.site.find({'extent.geometry.state':misSpelling});
while (sites.hasNext()) {
    let site = sites.next();

    let state = site.extent && site.extent.geometry && site.extent.geometry.state;

    if (Array.isArray(state)) {
        for (let i=0; i<state.length; i++) {
            if (state[i] === misSpelling) {
                state[i] = correctSpelling;
            }
        }
        db.site.save(site);
    }
    else if (typeof state == 'string') {
        site.extent.geometry.state = [correctSpelling];
        db.site.save(site);
    }
}