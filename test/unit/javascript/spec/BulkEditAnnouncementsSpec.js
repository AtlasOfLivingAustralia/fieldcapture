describe("the EditAnnouncementsViewModel", function () {

    var model, grid;
    var initialiseEvents = function (projects) {
        var tmpEvents = [];
        for (var i=0; i<projects.length; i++) {
            var id = projects[i].projectId;
            for (var j=0; j<projects[i].eventCount; j++) {
                tmpEvents.push({projectId:id, name:"Project "+id, grantId:"Grant"+id, eventName:"name "+j+" for project "+id, eventDescription:"description "+j+" for project "+id});
            }
        }
        return tmpEvents;
    };
    beforeEach(function() {
        grid = {
            onAddNewRow:{subscribe:function(){}},
            onCellChange:{subscribe:function(){}},
            onClick:{subscribe:function(){}},
            setData:function(){},
            invalidateAllRows:function(){},
            updateRowCount:function(){},
            render:function(){},
            invalidateRow:function(){}
        };
        window.bootbox = {
            confirm : function(message, callback) {
                callback(true);
            }
        };

        var events = initialiseEvents([{projectId:'1', eventCount:3}, {projectId:'2', eventCount:1}, {projectId:3, eventCount:4}]);
        model = new EditAnnouncementsViewModel(grid, events);
    });
    afterEach(function() {
        delete window.bootbox;
    });

    it("should not return any data if nothing has changed", function () {
       expect(model.modelAsJSON()).toEqual("[]");
    });

    it("should return all announcements for a project if any event related to that project is edited", function() {
        model.eventEdited({projectId:'1', eventName:'test'}, {});
        var result = JSON.parse(model.modelAsJSON());
        expect(result.length).toEqual(1);
        expect(result[0].projectId).toEqual('1');
        expect(result[0].announcements.length).toEqual(3);
    });

    it("should return all announcements for a project if a new event for a project is added", function() {
        model.insertRow(2);
        var result = JSON.parse(model.modelAsJSON());
        expect(result.length).toEqual(1);
        expect(result[0].projectId).toEqual('1');
        expect(result[0].announcements.length).toEqual(4);
    });

    it("should return all announcements for a project if an event is deleted", function() {
        model.deleteRow(2);
        var result = JSON.parse(model.modelAsJSON());
        expect(result.length).toEqual(1);
        expect(result[0].projectId).toEqual('1');
        expect(result[0].announcements.length).toEqual(2);
    });

    it("should update the previous and current project if the project name is edited", function(){
        model.eventEdited({projectId:'1', name:'Project 2'}, {cell:1});
        var result = JSON.parse(model.modelAsJSON());
        expect(result.length).toEqual(2);
        expect(result[0].projectId).toEqual('1');
        expect(result[1].projectId).toEqual('2');
    });

    it("should update the grantId and projectId if the project name is edited", function(){
        var event = {projectId:'1', name:'Project 2'};
        model.eventEdited(event, {cell:1});
        expect(event.projectId).toEqual('2');
        expect(event.grantId).toEqual('Grant2');
    });

    function event(projectId, name, description) {
        return {projectId:projectId, name:name, description:description}
    }

    function stubGrid() {
        return
    }
});
