describe("multiSelect2 binding handler Spec", function () {

    var mockElement;
    var model;
    beforeEach(function () {
        jasmine.clock().install();

        mockElement = document.createElement('input');
        document.body.appendChild(mockElement);

    });

    afterEach(function () {
        jasmine.clock().uninstall();
        document.body.removeChild(mockElement);
    });

    it("The warningPopup binding ...", function () {

        model = {
            data: ko.observable('1'),
            valid: ko.observable(true)
        }
        $(mockElement).attr('data-warningmessage', 'Warning!');
        $(mockElement).attr('data-bind', 'value:data,warningPopup:valid');

        ko.applyBindings(model, mockElement);
        jasmine.clock().tick(10);
        expect($('.popover.warning').length).toEqual(0);

        model.valid(false);
        jasmine.clock().tick(10);
        expect($('.popover.warning').length).toEqual(1);
        expect($('.popover-body').text()).toEqual("Warning!");

        model.valid(true);
        jasmine.clock().tick(1);
        expect($('.popover.warning').length).toEqual(0);

        model.valid(false);
        jasmine.clock().tick(10);
        expect($('.popover.warning').length).toEqual(1);

        $('.popover.warning').click();
        jasmine.clock().tick(10);
        expect($('.popover.warning').length).toEqual(0);

    });
});