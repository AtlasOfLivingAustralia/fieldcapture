const downloadableProtocols = [
    'Cover - Standard',
    'Cover - Enhanced',
    'Floristics - Standard',
    'Floristics - Enhanced',
'Plot Layout and Visit',
'Vegetation Mapping',
'Plot Description - Standard',
'Plot Description - Enhanced',
    'Plant Tissue Vouchering - Standard',
    'Plant Tissue Vouchering - Enhanced',
    'Photo Points - DSLR Panorama',
    'Photo Points - Compact Panorama',
    'Photo Points - Device Panorama',
    'Opportune',
    'Fauna Ground Counts Vantage Point',
    'Fauna Ground Counts Transects',
    'Sign-based Fauna Surveys - Off-plot Belt Transect',
    'Sign-based Fauna Surveys - Within-plot Belt Transect',
    'Herbivory and Physical Damage - Active Plot Search',
    'Herbivory and Physical Damage - Off-plot Transect',
    'Herbivory and Physical Damage - Within-plot Belt Transect'

];

db.activityForm.find({name:{'$in':downloadableProtocols}}).forEach(function(form) {
    if (!form.tags.indexOf("bdr_download_supported") > -1) {
        form.tags.push("bdr_download_supported");
        db.activityForm.replaceOne({_id:form._id}, form);
    }
});