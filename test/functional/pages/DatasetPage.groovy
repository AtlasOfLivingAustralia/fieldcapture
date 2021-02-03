package pages

import geb.Module
import pages.modules.DatasetPageModule

class DatasetPage extends Module{
    static content = {
        addNewDataset(required: false) {$('#project-data-sets .btn-primary')}
        datasetContent(required: false) {module DatasetPageModule}
    }

}
