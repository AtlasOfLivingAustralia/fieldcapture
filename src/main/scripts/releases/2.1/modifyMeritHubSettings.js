var now = ISODate();
var setting = db.setting.findOne({key:'meritaccessexpiry.warning.email.subject'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritaccessexpiry.warning.email.subject'
    }
}
setting.lastUpdated = now;
setting.value = 'Access to MERIT';
setting.description = 'The subject of the email to send warn a user their access to MERIT will be removed if no action is taken';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritaccessexpiry.warning.email.body'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritaccessexpiry.warning.email.body'
    }
}
setting.lastUpdated = now;
setting.value = 'Dear MERIT User\n\nOur records indicate that you have not logged into MERIT (https://fieldcapture.ala.org.au/) for nearly two years.\n\nYour access will be removed 2 weeks from today, unless you take the following action:\n\nIf you wish to retain your access at your current level, all you need to do is log into MERIT within two weeks of the date of this email.\n\nIf you no longer require access, you do not need to do anything. Your access will be automatically removed two weeks from today.\n\nIf you require access at a future stage, or miss the two week deadline, please contact the MERIT Team (merit@ala.org.au) and we can assist you.\n\nRegards\nThe MERIT Team\nDepartment of Agriculture, Water and the Environment\nmerit@ala.org.au\nhttps://fieldcapture.ala.org.au/';
setting.description = 'The body of the email to send to warn a user their access to MERIT will be removed if no action is taken';
db.setting.save(setting);





setting = db.setting.findOne({key:'meritaccessexpiry.expired.email.subject'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritaccessexpiry.expired.email.subject'
    }
}
setting.lastUpdated = now;
setting.value = 'Access to MERIT has been removed';
setting.description = 'The subject of the email to send when access has been removed due to no login to MERIT for a specified time';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritaccessexpiry.expired.email.body'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritaccessexpiry.expired.email.body'
    }
}
setting.lastUpdated = now;
setting.value = 'Dear MERIT User\n\nFurther to our previous email, your access to MERIT (https://fieldcapture.ala.org.au/) has now been removed.\nIf you feel this has been done in error, or require access at a future stage, please contact the MERIT Team (merit@ala.org.au) and we can assist you..\n\nRegards\nThe MERIT Team\nDepartment of Agriculture, Water and the Environment\nmerit@ala.org.au\nhttps://fieldcapture.ala.org.au/';
setting.description = 'The body of the email to send when access has been removed due to no login to MERIT for a specified time';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritpermissionexpiry.expired.email.subject'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritpermissionexpiry.expired.email.subject'
    }
}
setting.lastUpdated = now;
setting.value = 'Access to MERIT';
setting.description = 'The subject of the email to send when a role has been removed due to it expiring';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritpermissionexpiry.expired.email.body'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritpermissionexpiry.expired.email.body'
    }
}
setting.lastUpdated = now;
setting.value = 'Dear MERIT User\n\nYour elevated access to MERIT (https://fieldcapture.ala.org.au/) has now been removed.\nIf you feel this has been done in error, or require access at a future stage, please contact the MERIT Team (merit@ala.org.au) and we can assist you..\n\nRegards\nThe MERIT Team\nDepartment of Agriculture, Water and the Environment\nmerit@ala.org.au\nhttps://fieldcapture.ala.org.au/';
setting.description = 'The subject of the email to send when a role has been removed due to it expiring';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritpermissionwarning.expiry.email.subject'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritpermissionwarning.expiry.email.subject'
    }
}
setting.lastUpdated = now;
setting.value = 'Access to MERIT Expiring in 1 Month';
setting.description = 'The subject of the email sent to a user when their elevated access will expire 1 month from now';
db.setting.save(setting);


setting = db.setting.findOne({key:'meritpermissionwarning.expiry.email.body'});
if (!setting) {
    setting = {
        dateCreated:now,
        key:'meritpermissionwarning.expiry.email.body'
    }
}
setting.lastUpdated = now;
setting.value = 'Dear MERIT User\n\nYour elevated access to MERIT (https://fieldcapture.ala.org.au/) will be removed 1 month from now.\nIf you require access extension, please contact the MERIT Team (merit@ala.org.au) and we can assist you..\n\nRegards\nThe MERIT Team\nDepartment of Agriculture, Water and the Environment\nmerit@ala.org.au\nhttps://fieldcapture.ala.org.au/';
setting.description = 'The body of the email sent to a user when their elevated access will expire 1 month from now';
db.setting.save(setting);


// Configure the MERIT hub to use the access management features
var merit = db.hub.findOne({urlPath:'merit'});
merit.accessManagementOptions = {
    "expireUsersAfterPeriodInactive": "P24M",
    "warnUsersAfterPeriodInactive": "P23M"
};
merit.emailFromAddress = "merit@ala.org.au";
merit.emailReplyToAddress = "merit@ala.org.au";

// Add the activity type facet
const activityTypeField = 'activities.type.keyword';
if (merit.availableFacets.indexOf(activityTypeField) < 0) {
    merit.availableFacets.push(activityTypeField);
    merit.adminFacets.push(activityTypeField);
}

db.hub.save(merit);