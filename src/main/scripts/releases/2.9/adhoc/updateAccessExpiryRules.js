load("../../../utils/audit.js");
const adminUserId = '<anon>'; // replace me before running.

let meritHub = db.hub.findOne({urlPath:'merit'});
let users = db.user.find({'userHubs.hubId':meritHub.hubId});

const resetLoginTime = new ISODate('2022-11-01T00:00:00Z');

while (users.hasNext()) {
    let user = users.next();
    if (!user.userHubs || user.userHubs.length > 1) {
        throw "Unexpected userHubs record for user "+user.userId;
    }
    user.userHubs[0].lastLoginTime = resetLoginTime;

    db.user.replaceOne({_id:user._id}, user);
    audit(user, user.userId, 'au.org.ala.ecodata.User', adminUserId);
}

meritHub.accessManagementOptions.expireUsersAfterPeriodInactive = 'P26W';
meritHub.accessManagementOptions.warnUsersAfterPeriodInactive = 'P24W';
db.hub.replaceOne({hubId:meritHub.hubId}, meritHub);
