const floristicsDependentModules = [
    'Cover + Fire - Standard',
    'Cover + Fire - Enhanced',
    'Fire Survey',
    'Floristics - Enhanced',
    'Floristics - Standard',
    'Plant Tissue Vouchering - Enhanced',
    'Plant Tissue Vouchering - Standard',
    'Cover - Standard',
    'Cover - Enhanced',
    'Basal Area - Basal Wedge',
    'Basal Area - DBH',
    'Recruitment - Survivorship',
    'Recruitment - Age Structure',
    ''

];

db.activityForm.find({name:{'$in':floristicsDependentModules}}).forEach(function(form) {
    form.tags = Array.isArray(form.tags) ? form.tags : [];
    if (!form.tags.includes("floristics")) {
        form.tags.push("floristics");
        db.activityForm.replaceOne({_id:form._id}, form);
    }
    print(form.name + ' : ' + JSON.stringify(form.tags));
});