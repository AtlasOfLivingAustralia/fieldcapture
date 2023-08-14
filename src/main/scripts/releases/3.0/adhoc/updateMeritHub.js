// Update Reply-To email address
var merit = db.hub.findOne({urlPath:'merit'});
merit.emailReplyToAddress = "merit@dcceew.gov.au";
db.hub.save(merit);