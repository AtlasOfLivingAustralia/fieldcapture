const downloadableProtocols = [
    'Cover - Standard',
    'Cover - Enhanced',
    'Floristics - Standard',
    'Floristics - Enhanced',
'Plot Layout and Visit',
'Vegetation Mapping',
'Plot Description - Standard',
'Plot Description - Enhanced',
'Plot Selection',
    'Plant Tissue Vouchering - Standard',
    'Plant Tissue Vouchering - Enhanced',
    'Photo Points - DSLR Panorama',
    'Photo Points - Compact Panorama',
    'Photo Points - Device Panorama'

];

db.activityForm.find({name:{'$in':downloadableProtocols}}).forEach(function(form) {
    if (!form.tags.indexOf("bdr_download_supported") > -1) {
        form.tags.push("bdr_download_supported");
        db.activityForm.replaceOne({_id:form._id}, form);
    }
});