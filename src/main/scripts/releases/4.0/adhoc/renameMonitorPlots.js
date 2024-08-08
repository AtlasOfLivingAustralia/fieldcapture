load('../../../utils/audit.js');
let adminUserId = '<TBA>';

let plots = [
    {
        oldName: 'VCMMDD0001',
        newName: 'VCMMDD0016'
    },
    {
        oldName: 'VCMMDD0002',
        newName: 'VCMMDD0017'
    },
    {
        oldName: 'VCMMDD0003',
        newName: 'VCMMDD0018'
    },
    {
        oldName: 'VCMMDD0004',
        newName: 'VCMMDD0019'
    },
    {
        oldName: 'VCMMDD0005',
        newName: 'VCMMDD0020'
    },
    {
        oldName: 'VCMMDD0006',
        newName: 'VCMMDD0021'
    },
    {
        oldName: 'VCMMDD0007',
        newName: 'VCMMDD0022'
    },
    {
        oldName: 'VCMMDD0008',
        newName: 'VCMMDD0023'
    },
    {
        oldName: 'VCMMDD0009',
        newName: 'VCMMDD0024'
    }
]

/*
VCMMDD0001 #2 --> VCMMDD0016
ID=28
UUID=e1f0f683-2d3a-4fe9-bed6-13beab7a5644
(start at #0016 as #0010 to #0015 already created)
VCMMDD0002 #2 --> VCMMDD0017
ID=29
UUID=c3238980-0fbc-4f4c-97da-4b67c34f2375
VCMMDD0003 #2 --> VCMMDD0018
ID=30
UUID=67687487-8b67-45fc-9d41-30332edf4136
VCMMDD0004 #2 --> VCMMDD0019
ID=31
UUID=e950e057-a12e-4a88-a539-41a31b3471cd
VCMMDD0005 #2 --> VCMMDD0020
ID=32
UUID=f9b16a2e-4fe6-4f10-9376-c7b0001029da
VCMMDD0006 #2 --> VCMMDD0021
ID=33
UUID=9c08f3ac-caf9-4d88-9459-92ef0a59547b
VCMMDD0007 #2 --> VCMMDD0022
ID=34
UUID=0b7128ad-5297-48a6-b470-aead8d3b3ee6
VCMMDD0008 #2 --> VCMMDD0023
ID=36
UUID=b3d4b3e3-18e9-490c-83fa-1ac03cee851c
VCMMDD0009 #2 --> VCMMDD0024
ID=37
UUID=0176ed7d-31ea-4def-adb9-bd387bd74176
*/

let projectId = 'c9c9d206-9a9d-41bb-b984-7f692d4474ac';

for (let i=0; i<plots.length; i++) {
    let plot = plots[i];
    let oldPlot = db.site.findOne({projects:projectId, name:plot.oldName});
    if (!oldPlot) {
        print("No plot found for "+plot.oldName);
    }
    else {
        oldPlot.name = plot.newName;
        db.site.replaceOne({siteId:oldPlot.siteId}, oldPlot);
        audit(oldPlot, oldPlot.siteId, 'org.ala.ecodata.Site', adminUserId, projectId);
        print("replacing "+plot.oldName+" with "+plot.newName);
    }

    let layedOutName = plot.oldName + ' - Not applicable (100 x 100)';
    let layedOutPlots = db.site.find({projects:projectId, name:layedOutName});
    if (!layedOutPlots.hasNext()) {
        print("No layed out plot found for "+layedOutName);
    }
    while (layedOutPlots.hasNext()) {
        let layedOutPlot = layedOutPlots.next();
        layedOutPlot.name = plot.newName + ' - Not applicable (100 x 100)';
        db.site.replaceOne({siteId:layedOutPlot.siteId}, layedOutPlot);
        audit(layedOutPlot, layedOutPlot.siteId, 'org.ala.ecodata.Site', adminUserId, projectId);

        print("replacing "+layedOutName+" with "+plot.newName+ ' - Not applicable (100 x 100)');
    }
}