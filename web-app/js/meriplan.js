/*
   Script for handling Project MERI Plan
 */

function MERIPlan(project, themes, key) {
   var self = this;
   if(!project.custom){ project.custom = {};}
   if(!project.custom.details){project.custom.details = {};}

   var savedProjectCustomDetails = amplify.store(key);
   if (savedProjectCustomDetails) {
      var restored = JSON.parse(savedProjectCustomDetails);
      if (restored.custom) {
         $('#restoredData').show();
         project.custom.details = restored.custom.details;
      }
   }

   self.details = new DetailsViewModel(project.custom.details, getBugetHeaders(project.timeline));
   self.detailsLastUpdated = ko.observable(project.custom.details.lastUpdated).extend({simpleDate: true});
   self.isProjectDetailsSaved = ko.computed (function (){
      return (project['custom']['details'].status == 'active');
   });
   self.isProjectDetailsLocked = ko.computed (function (){
      return (project.planStatus == 'approved' || project.planStatus =='submitted');
   });

   self.projectThemes =  $.map(themes, function(theme, i) { return theme.name; });
   self.projectThemes.push("MERI & Admin");
   self.projectThemes.push("Others");

   self.likelihoodOptions = ['Almost Certain', 'Likely', 'Possible', 'Unlikely', 'Remote'];
   self.consequenceOptions = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Extreme'];
   self.ratingOptions = ['High', 'Significant', 'Medium', 'Low'];
   self.obligationOptions = ['Yes', 'No'];
   self.threatOptions = ['Blow-out in cost of project materials', 'Changes to regional boundaries affecting the project area', 'Co-investor withdrawal / investment reduction',
      'Lack of delivery partner capacity', 'Lack of delivery partner / landholder interest in project activities', 'Organisational restructure / loss of corporate knowledge', 'Organisational risk (strategic, operational, resourcing and project levels)',
      'Seasonal conditions (eg. drought, flood, etc.)', 'Timeliness of project approvals processes',
      'Workplace health & safety (eg. Project staff and / or delivery partner injury or death)'];
   self.organisations =['Academic/research institution', 'Australian Government Department', 'Commercial entity', 'Community group',
      'Farm/Fishing Business', 'If other, enter type', 'Indigenous Organisation', 'Individual', 'Local Government', 'Other', 'Primary Industry group',
      'School', 'State Government Organisation', 'Trust'];
   self.protectedNaturalAssests =[ 'Natural/Cultural assets managed','Threatened Species', 'Threatened Ecological Communities',
      'Migratory Species', 'Ramsar Wetland', 'World Heritage area', 'Community awareness/participation in NRM', 'Indigenous Cultural Values',
      'Indigenous Ecological Knowledge', 'Remnant Vegetation', 'Aquatic and Coastal systems including wetlands', 'Not Applicable'];

   self.addBudget = function(){
      self.details.budget.rows.push (new BudgetRowViewModel({},getBugetHeaders(project.timeline)));
   };
   self.removeBudget = function(budget){
      self.details.budget.rows.remove(budget);
   };

   self.addObjectives = function(){
      self.details.objectives.rows.push(new GenericRowViewModel());
   };
   self.addOutcome = function(){
      self.details.objectives.rows1.push(new OutcomeRowViewModel());
   };
   self.removeObjectives = function(row){
      self.details.objectives.rows.remove(row);
   };
   self.removeObjectivesOutcome = function(row){
      self.details.objectives.rows1.remove(row);
   };
   self.addNationalAndRegionalPriorities = function(){
      self.details.priorities.rows.push(new GenericRowViewModel());
   };
   self.removeNationalAndRegionalPriorities = function(row){
      self.details.priorities.rows.remove(row);
   };

   self.addKEQ = function(){
      self.details.keq.rows.push(new GenericRowViewModel());
   };
   self.removeKEQ = function(keq){
      self.details.keq.rows.remove(keq);
   };

   self.mediaOptions = [{id:"yes",name:"Yes"},{id:"no",name:"No"}];

   self.addEvents = function(){
      self.details.events.push(new EventsRowViewModel());
   };
   self.removeEvents = function(event){
      self.details.events.remove(event);
   };

   self.addPartnership = function(){
      self.details.partnership.rows.push (new GenericRowViewModel());
   };
   self.removePartnership = function(partnership){
      self.details.partnership.rows.remove(partnership);
   };

};

function DetailsViewModel(o, period) {
   var self = this;
   self.status = ko.observable(o.status);
   self.obligations = ko.observable(o.obligations);
   self.policies = ko.observable(o.policies);
   self.caseStudy = ko.observable(o.caseStudy ? o.caseStudy : false);
   self.keq = new GenericViewModel(o.keq);
   self.objectives = new ObjectiveViewModel(o.objectives);
   self.priorities = new GenericViewModel(o.priorities);
   self.implementation = new ImplementationViewModel(o.implementation);
   self.partnership = new GenericViewModel(o.partnership);
   self.lastUpdated = o.lastUpdated ? o.lastUpdated : moment().format();
   self.budget = new BudgetViewModel(o.budget, period);

   var row = [];
   o.events ? row = o.events : row.push(ko.mapping.toJS(new EventsRowViewModel()));
   self.events = ko.observableArray($.map(row, function (obj, i) {
      return new EventsRowViewModel(obj);
   }));

   self.modelAsJSON = function() {
      var tmp = {};
      tmp['details'] =  ko.mapping.toJS(self);
      var jsData = {"custom": tmp};
      var json = JSON.stringify(jsData, function (key, value) {
         return value === undefined ? "" : value;
      });
      return json;
   };
};

function GenericViewModel(o) {
   var self = this;
   if(!o) o = {};
   self.description = ko.observable(o.description);
   var row = [];
   o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
   self.rows = ko.observableArray($.map(row, function (obj,i) {
      return new GenericRowViewModel(obj);
   }));
};

function GenericRowViewModel(o) {
   var self = this;
   if(!o) o = {};
   self.data1 = ko.observable(o.data1);
   self.data2 = ko.observable(o.data2);
   self.data3 = ko.observable(o.data3);
};

function ObjectiveViewModel(o) {
   var self = this;
   if(!o) o = {};

   var row = [];
   o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
   self.rows = ko.observableArray($.map(row, function (obj, i) {
      return new GenericRowViewModel(obj);
   }));

   var row1 = [];
   o.rows1 ? row1 = o.rows1 : row1.push(ko.mapping.toJS(new OutcomeRowViewModel()));
   self.rows1 = ko.observableArray($.map(row1, function (obj, i) {
      return new OutcomeRowViewModel(obj);
   }));
};


function ImplementationViewModel(o) {
   var self = this;
   if(!o) o = {};
   self.description = ko.observable(o.description);
};

function EventsRowViewModel(o) {
   var self = this;
   if(!o) o = {};
   self.name = ko.observable(o.name);
   self.description = ko.observable(o.description);
   self.media = ko.observable(o.media);
   self.type = ko.observable(o.type || '');
   self.funding = ko.observable(o.funding).extend({numericString:0}).extend({currency:true});
   self.scheduledDate = ko.observable(o.scheduledDate).extend({simpleDate: false});
};

function OutcomeRowViewModel(o) {
   var self = this;
   if(!o) o = {};
   self.description = ko.observable(o.description);
   if(!o.assets) o.assets = [];
   self.assets = ko.observableArray(o.assets);
};

function BudgetViewModel(o, period){
   var self = this;
   if(!o) o = {};

   self.overallTotal = ko.observable(0.0);

   var headerArr = [];
   for(i = 0; i < period.length; i++){
      headerArr.push({"data":period[i]});
   }
   self.headers = ko.observableArray(headerArr);

   var row = [];
   o.rows ? row = o.rows : row.push(ko.mapping.toJS(new BudgetRowViewModel({},period)));
   self.rows = ko.observableArray($.map(row, function (obj, i) {
      // Headers don't match with previously stored headers, adjust rows accordingly.
      if(o.headers && period && o.headers.length != period.length) {
         var updatedRow = [];
         for(i = 0; i < period.length; i++) {
            var index = -1;

            for(j = 0; j < o.headers.length; j++) {
               if(period[i] == o.headers[j].data) {
                  index = j;
                  break;
               }
            }
            updatedRow.push(index != -1 ? obj.costs[index] : 0.0)
            index = -1;
         }
         obj.costs = updatedRow;
      }

      return new BudgetRowViewModel(obj,period);
   }));

   self.overallTotal = ko.computed(function (){
      var total = 0.0;
      ko.utils.arrayForEach(this.rows(), function(row) {
         if(row.rowTotal()){
            total += parseFloat(row.rowTotal());
         }
      });
      return total;
   },this).extend({currency:{}});

   var allBudgetTotal = [];
   for(i = 0; i < period.length; i++){
      allBudgetTotal.push(new BudgetTotalViewModel(this.rows, i));
   }
   self.columnTotal = ko.observableArray(allBudgetTotal);
};

function BudgetTotalViewModel (rows, index){
   var self = this;
   self.data =  ko.computed(function (){
      var total = 0.0;
      ko.utils.arrayForEach(rows(), function(row) {
         if(row.costs()[index]){
            total += parseFloat(row.costs()[index].dollar());
         }
      });
      return total;
   },this).extend({currency:{}});
};


function BudgetRowViewModel(o,period) {
   var self = this;
   if(!o) o = {};
   self.shortLabel = ko.observable(o.shortLabel);
   self.description = ko.observable(o.description);

   var arr = [];
   for(i = 0 ; i < period.length; i++)
      arr.push(ko.mapping.toJS(new FloatViewModel()));

   //Incase if timeline is generated.
   if(o.costs && o.costs.length != arr.length) {
      o.costs = arr;
   }
   o.costs ? arr = o.costs : arr;
   self.costs = ko.observableArray($.map(arr, function (obj, i) {
      return new FloatViewModel(obj);
   }));

   self.rowTotal = ko.computed(function (){
      var total = 0.0;
      ko.utils.arrayForEach(this.costs(), function(cost) {
         if(cost.dollar())
            total += parseFloat(cost.dollar());
      });
      return total;
   },this).extend({currency:{}});
};

function FloatViewModel(o){
   var self = this;
   if(!o) o = {};
   self.dollar = ko.observable(o.dollar ? o.dollar : 0.0).extend({numericString:2}).extend({currency:{}});
};

function limitText(field, maxChar){
   $(field).attr('maxlength',maxChar);
}

var EditAnnouncementsViewModel = function(grid, events) {
    var self = this;
    self.modifiedProjects = ko.observableArray([]);
    self.events = events.slice();

    function copyEvent(event) {
        return {
            eventName:event.eventName,
            eventDescription:event.eventDescription,
            funding:event.funding || '',
            eventDate:event.eventDate,
            eventType:event.eventType
        };
    }

    self.showBulkUploadOptions = ko.observable(false);
    self.toggleBulkUploadOptions = function() {
        self.showBulkUploadOptions(!self.showBulkUploadOptions);
    };

    self.dirtyFlag = {
        isDirty: ko.computed(function() {
            return self.modifiedProjects().length > 0;
        }),
        reset:function() {
            self.modifiedProjects([]);
        }
    };

    function projectModified(projectId) {
        if (self.modifiedProjects().indexOf(projectId) < 0) {
            self.modifiedProjects.push(projectId);
        }
    }

    function revalidateAll() {
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }

    self.findProjectIdForEvent = function(event) {
        for (var i=0; i<events.length; i++) {
            if (events[i].grantId == event.grantId && events[i].name == event.name) {
                return events[i].projectId;
            }
        }
        return null;
    };

    /**
     * Replaces all of the existing events with the supplied array.
     */
    self.updateEvents = function(newEvents) {
        var i;

        for (i=0; i<newEvents.length; i++) {
            var projectId = self.findProjectIdForEvent(newEvents[i]);
            if (projectId) {
                newEvents[i].projectId = projectId;
                projectModified(newEvents[i].projectId);
            }
            else {
                newEvents[i].grantId = undefined;
                newEvents[i].name = undefined;

            }
        }
        // In case all events for a project were deleted, add previously existing projects as well
        for (i=0; i<events.length; i++) {
            projectModified(events[i].projectId);
        }

        self.events = newEvents;
        grid.setData(self.events);
        revalidateAll();

        self.validate();
    };

    self.modelAsJSON = function() {
        var projects = [];
        for (var i=0; i<self.modifiedProjects().length; i++) {
            var projectAnnouncements = {projectId:self.modifiedProjects()[i], announcements:[]};
            for (var j=0; j<self.events.length; j++) {
                if (self.events[j].projectId == self.modifiedProjects()[i]) {
                    projectAnnouncements.announcements.push(copyEvent(self.events[j]));
                }

            }
            projects.push(projectAnnouncements);
        }
        return JSON.stringify(projects);
    };

    self.cancel = function() {
        self.cancelAutosave();
        document.location.href = fcConfig.organisationViewUrl;
    };

    self.save = function() {
        Slick.GlobalEditorLock.commitCurrentEdit();
        if (self.validate()) {
            self.saveWithErrorDetection(function() {
                document.location.href = fcConfig.organisationViewUrl;
            });
        }
    };

    self.insertRow = function(index) {
        var event = events[index];
        projectModified(event.projectId);
        self.events.splice(index+1, 0, {projectId:event.projectId, name:event.name, grantId:event.grantId});
        revalidateAll();
    };

    self.deleteRow = function(index) {
        bootbox.confirm("Are you sure you want to delete this announcement?", function(ok) {
            if (ok) {
                var deleted = self.events.splice(index, 1);
                projectModified(deleted[0].projectId);
                revalidateAll();
            }
        });
    };

    self.addRow = function(item, args) {
        self.events.push(item);
        if (item.name) {
            self.projectNameEdited(item, args);
        }
        revalidateAll();
    };

    self.eventEdited = function(event, args) {
        projectModified(event.projectId);
        if (args.cell == 1) {
            self.projectNameEdited(event, args);
            grid.invalidateRow(args.row);
            grid.render();
        }

    };

    self.projectNameEdited = function(event, args) {
        // The project has been changed.
        for (var i=0; i<self.events.length; i++) {
            if (self.events[i].name == event.name) {
                event.projectId = self.events[i].projectId;
                event.grantId = self.events[i].grantId;
                projectModified(event.projectId); // Both the previous and new projects have been modified.
                break;
            }
        }
    };

    self.validate = function() {
        var valid = true;
        var columns = grid.getColumns();
        for (var i=0; i<columns.length; i++) {
            if (columns[i].validationRules) {
                var validationFunctions = parseValidationString(columns[i].validationRules);

                for (var project=0; project<self.modifiedProjects().length; project++) {
                    for (var j=0; j<self.events.length; j++) {
                        if (self.events[j].projectId == self.modifiedProjects()[project]) {
                            var field = columns[i]['field'];
                            var value = self.events[j][field];

                            for (var k=0; k<validationFunctions.length; k++) {
                                var result = validationFunctions[k](field, value);
                                if (!result.valid) {
                                    valid = false;
                                    var columnIdx = columnIndex(result.field, grid.getColumns());
                                    var node = grid.getCellNode(j, columnIdx);
                                    if (node) {
                                        validationSupport.addPrompt($(node), 'event'+j, result.field, result.error);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }

        return valid;
    };

    // Attach event handlers to the grid
    grid.onAddNewRow.subscribe(function (e, args) {
        var item = args.item;
        self.addRow(item, args);
    });
    grid.onCellChange.subscribe(function(e, args) {
        self.eventEdited(args.item, args);
    });

    grid.onClick.subscribe(function(e) {
        if ($(e.target).hasClass('icon-plus')) {
            self.insertRow(grid.getCellFromEvent(e).row);
        }
        else if ($(e.target).hasClass('icon-remove')) {
            self.deleteRow(grid.getCellFromEvent(e).row);
        }
    });
    grid.setData(self.events);
};