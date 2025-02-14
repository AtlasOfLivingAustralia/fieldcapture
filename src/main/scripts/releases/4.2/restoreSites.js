load("../../utils/audit.js");
let projectId = '7743afa2-6a8d-4476-a38d-964c037421bd';
let excludedNames = ['219', '259', '284', '1022', '1331', '830', '228', '1434', '1047'];

db.site.find({projects:projectId, type:'worksArea', name: {$nin: excludedNames}}).forEach(function(site) {
    site.status = 'active';
    site.notes = null;

    db.site.replaceOne({_id:site._id}, site);

    audit('site', site.siteId, 'update', '<system>');
});