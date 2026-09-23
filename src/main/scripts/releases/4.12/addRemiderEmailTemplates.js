let now = ISODate();
let settings = [{

    dateCreated: now,
    lastUpdated: now,
    value: 'Dear MERIT User, \r\n' +
        'the ${report.name} for project ${project.grantId} is due on ${report.dueDate}. \r\n' +
        'You can access the report by logging into MERIT and then clicking onto this link https://merit.test.ala.org.au/project/editReport/${project.projectId}?reportId=${report.reportId}.\r\n' +
        'If you are experiencing problems submitting your report by this date, please contact your Departmental contract manager. Please do not reply to this email.\r\n',
    key: 'meritfielddata.report.dueSoon.emailBody'
},
    {

        dateCreated: now,
        lastUpdated: now,
        value: 'Your ${report.name} is due soon',
        key: 'meritfielddata.report.dueSoon.emailSubject'
    },

    {

        dateCreated: now,
        lastUpdated: now,
        value: 'Dear MERIT User, \r\n' +
            'the ${report.name} for project ${project.grantId} was due on ${report.dueDate} and is now overdue. \r\n' +
            'You can access the report by logging into MERIT and then clicking onto this link https://merit.test.ala.org.au/project/editReport/${project.projectId}?reportId=${report.reportId}. \r\n' +
            'If you are experiencing problems submitting your report, please contact your Departmental contract manager as a priority. \r\n' +
            'Please do not reply to this email.',
        key: 'meritfielddata.report.overdue.emailBody'
    },
    {

        dateCreated: now,
        lastUpdated: now,
        value: 'Your ${report.name} is overdue',
        key: 'meritfielddata.report.overdue.emailSubject'
    },
    {

        dateCreated: now,
        lastUpdated: now,
        value: 'Dear MERIT User, \r\n' +
            'the ${report.name} for project ${project.grantId} is due today. \r\n' +
            'You can access the report by logging into MERIT and then clicking onto this link https://merit.test.ala.org.au/project/editReport/${project.projectId}?reportId=${report.reportId}\r\n' +
            'If you are experiencing problems submitting your report by today, please contact your Departmental contract manager as a priority. \r\n' +
            'Please do not reply to this email.',
        key: 'meritfielddata.report.dueToday.emailBody'
    },
    {

        dateCreated: now,
        lastUpdated: now,
        value: 'Your ${report.name} is due today ',
        key: 'meritfielddata.report.dueToday.emailSubject'
    }];

for (let i = 0; i < settings.length; i++) {
    let setting = settings[i];
    let existingSetting = db.setting.findOne({key: setting.key});
    if (!existingSetting) {
        db.setting.insertOne(setting);
        print("Inserted setting with key: " + setting.key);
    } else {
        db.setting.replaceOne({key: setting.key}, {$set: {value:setting.value, lastUpdated:now}});
        print("Setting with key: " + setting.key + " already exists, overwriting.");
    }
}

