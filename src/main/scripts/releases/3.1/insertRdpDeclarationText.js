var rdpDeclarationText = [
    {
        "key":"meritfielddata.rdp.report.declaration",
        "value":'1. I declare that I am legally authorised to submit this report on behalf of the Regional Delivery Partner pursuant to the Deed of Standing Offer (Deed) between the Regional Delivery Partner and the Commonwealth. \r\n' +
            '2. I understand that, under the Deed, all information I submit may constitute Contract Material.\r\n' +
            '3. I understand that, through the Deed, the Commonwealth is licensed to use, reproduce, modify, adapt, communicate, publish, broadcast and distribute the Contract Material on the terms set out in the Deed.\r\n' +
            '4. I declare that the information I submit is complete and correct and not false or misleading. I understand that it is an offence under the Criminal Code Act 1995 (Cth) to provide false or misleading information.'
    }
]

for (var i=0; i<rdpDeclarationText.length; i++) {
    var setting = {
        key: rdpDeclarationText[i].key,
        value: rdpDeclarationText[i].value,
        dateCreated: ISODate(),
        lastUpdated: ISODate()
    };
    if (db.setting.findOne({key: setting.key})) {
        print("Inserting " + setting.key)
        db.setting.replaceOne({key: setting.key}, setting);
    } else {
        print("Updating " + setting.key)
        db.setting.insertOne(setting);
    }
}
