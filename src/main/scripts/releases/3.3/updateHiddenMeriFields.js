db.project.updateMany(
    {'custom.details.supportsPriorityPlace':'No', 'custom.details.supportedPriorityPlaces':{$ne:[]}},
    {$set:{'custom.details.supportedPriorityPlaces':[]}});


db.project.updateMany(
    {'custom.details.indigenousInvolved':'No', 'custom.details.indigenousInvolvementType':{$ne:''}},
    {$set:{'custom.details.indigenousInvolvementType':''}}
);

db.project.updateMany(
    {'custom.details.indigenousInvolved':'Yes', 'custom.details.indigenousInvolvementComment':{$ne:''}},
    {$set:{'custom.details.indigenousInvolvementComment':''}}
);
