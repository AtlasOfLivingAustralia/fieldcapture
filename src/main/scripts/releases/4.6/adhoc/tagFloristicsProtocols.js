const floristicsDependentModules = [
    'Basal area',
    'Condition',
    'Cover',
    'Fire Severity',
    'Plant tissue vouchering',
    'Recruitment'
];

db.activityForm.find({name:{'$in':floristicsDependentModules}}).forEach(function(form) {
    form.tags = Array.isArray(form.tags) ? form.tags : [];
    if (!form.tags.includes("floristics")) {
        form.tags.push("floristics");
        db.activityForm.replaceOne({_id:form._id}, form);
    }
    print(form.name + ' : ' + JSON.stringify(form.tags));
});