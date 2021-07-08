describe("Expression data binding Spec", function () {

    beforeEach(function () {
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });
    it("It will not add a value to the select options  after initialisation", function () {

        var model = {
            value:ko.observable('3'),
            options:['1','2', '3']
        };

        var mockElement = document.createElement('select');
        mockElement.setAttribute('data-bind', 'addValueToOptionsIfMissing:true, options:options, value:value');

        ko.applyBindings(model, mockElement);
        jasmine.clock().tick(10);

        expect(mockElement.children.length).toBe(3);
        expect($(mockElement).val()).toBe("3");

        // The value shouldn't be added to the list after initialisation.
        model.value('4');
        expect(mockElement.children.length).toBe(3);
        expect($(mockElement).val()).toBe("3");
    });

    it("It will add the value to the select options during initialisation if necessary", function () {

        var model = {
            value:ko.observable('4'),
            options:['1','2', '3']
        };

        var mockElement = document.createElement('select');
        mockElement.setAttribute('data-bind', 'addValueToOptionsIfMissing:true, options:options, value:value');

        ko.applyBindings(model, mockElement);
        jasmine.clock().tick(10);

        expect(mockElement.children.length).toBe(4);
        expect($(mockElement).val()).toBe("4");

    });

    it("It will add the value to the select options during initialisation if necessary, even if the options is an observable", function () {

        var model = {
            value:ko.observable('4'),
            options:ko.observableArray(['1','2', '3'])
        };

        var mockElement = document.createElement('select');
        mockElement.setAttribute('data-bind', 'addValueToOptionsIfMissing:true, options:options, value:value');

        ko.applyBindings(model, mockElement);
        jasmine.clock().tick(10);

        expect(mockElement.children.length).toBe(4);
        expect($(mockElement).val()).toBe("4");

    });
});