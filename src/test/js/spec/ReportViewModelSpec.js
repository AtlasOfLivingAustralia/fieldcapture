describe("Tests for the ReportViewModel", function () {
    it("Will calculate the end date differently if the end date aligns with the owner/project end date", function() {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}, isLast:true};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            statusChangeHistory:{comment:"test"}
        };
        var viewModel = new ReportViewModel(report, config);

        // Because the end date matches the project end date (and is the last report in the category), it will display the date directly (ignoring time).
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

        config.reportOwner.endDate = '2021-06-29T14:00:00Z';
        report.toDate = '2020-06-30T14:00:00Z';
        var viewModel = new ReportViewModel(report, config);

        // Even though the report toDate is actuall 12am 1 July 2020 AEST, it should be displayed as June 30.
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

    });

    it("it will display the cancel button for Outcomes Report 1", function () {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            category:'Outcomes Report 1'
        };
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.outcomeCategory()).toBe(true);
    });

    it("it will display the cancel comment/reason in the Outcomes Report 1 status column", function () {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            category:'Outcomes Report 1',
            statusChangeHistory:[{comment:"test comment"}]
        };
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.cancelledCommentText).toBe("test comment");
    });
});
describe("Tests for editing the due date of a report", function () {

    var config;
    var report;
    let originalBlockUI;
    let originalUnblockUI;

    beforeEach(function () {
        config = {
            reportOwner: {endDate: '2020-06-29T14:00:00Z'},
            updateReportDueDateUrl: '/project/ajaxUpdateReportDueDate/p1'
        };
        report = {
            reportId: 'r1',
            description: 'Report 1',
            fromDate: '2019-12-31T13:00:00Z',
            toDate: '2020-06-29T14:00:00Z',
            dueDate: '2020-07-31T14:00:00Z'
        };
        originalBlockUI = $.blockUI;
        originalUnblockUI = $.unblockUI;
        $.blockUI = function () {};
        $.unblockUI = function () {};
    });

    afterEach(function () {
        $.blockUI = originalBlockUI;
        $.unblockUI = originalUnblockUI;
    });

    it("will allow the due date of a report that hasn't been submitted to be edited", function () {
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.canEditDueDate()).toBe(true);
    });

    it("will not allow the due date of a submitted, approved or cancelled report to be edited", function () {
        var readOnlyStatuses = ['pendingApproval', 'published', 'cancelled'];
        for (var i = 0; i < readOnlyStatuses.length; i++) {
            report.publicationStatus = readOnlyStatuses[i];
            var viewModel = new ReportViewModel(report, config);
            expect(viewModel.canEditDueDate()).toBe(false);
        }
    });

    it("will not allow the due date to be edited if no url has been configured to save it", function () {
        delete config.updateReportDueDateUrl;
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.canEditDueDate()).toBe(false);
    });

    it("will save the due date and close the modal when the user clicks save", function () {
        var savedDueDate;
        var closed = false;
        var viewModel = new EditReportDueDateViewModel(new ReportViewModel(report, config), {
            saveCallback: function (dueDate) {
                savedDueDate = dueDate;
                return $.Deferred().resolve({success: true});
            },
            closeCallback: function () {
                closed = true;
            }
        });

        expect(viewModel.reportName).toEqual('Report 1');
        expect(viewModel.dueDate()).toEqual('2020-07-31T14:00:00Z');

        viewModel.save(viewModel, {target: document.createElement('button')});

        expect(savedDueDate).toEqual('2020-07-31T14:00:00Z');
        expect(closed).toBe(true);
        expect(viewModel.saving()).toBe(false);
        expect(viewModel.error()).toBeFalsy();
    });

    it("will display an error and leave the modal open if the due date cannot be saved", function () {
        var closed = false;
        var viewModel = new EditReportDueDateViewModel(new ReportViewModel(report, config), {
            saveCallback: function () {
                return $.Deferred().reject({responseJSON: {error: 'Report is read only'}});
            },
            closeCallback: function () {
                closed = true;
            }
        });

        viewModel.save(viewModel, {target: document.createElement('button')});

        expect(closed).toBe(false);
        expect(viewModel.saving()).toBe(false);
        expect(viewModel.error()).toEqual('Report is read only');
    });

    it("will display a default error message if the server doesn't supply one", function () {
        var viewModel = new EditReportDueDateViewModel(new ReportViewModel(report, config), {
            saveCallback: function () {
                return $.Deferred().reject({});
            },
            closeCallback: function () {}
        });

        viewModel.save(viewModel, {target: document.createElement('button')});

        expect(viewModel.error()).toEqual('An error occurred while saving the due date.  Please try again.');
    });

    it("will close the modal without saving when the user cancels", function () {
        var closed = false;
        var saved = false;
        var viewModel = new EditReportDueDateViewModel(new ReportViewModel(report, config), {
            saveCallback: function () {
                saved = true;
                return $.Deferred().resolve({});
            },
            closeCallback: function () {
                closed = true;
            }
        });

        viewModel.cancel();

        expect(closed).toBe(true);
        expect(saved).toBe(false);
    });

    describe("Tests for the due date modal", function () {

        var $template;

        beforeEach(function () {
            $template = $('<script type="text/html" id="edit-due-date-modal-template"></scr' + 'ipt>');
            $template.text(
                '<div class="modal validationEngineContainer" id="edit-due-date-modal">' +
                '<span class="report-name" data-bind="text:reportName"></span>' +
                '<input type="text" data-bind="value:dueDate.formattedDate">' +
                '<button class="save" data-bind="click:save, disable:saving"></button>' +
                '</div>');
            $(document.body).append($template);
        });

        afterEach(function () {
            var modal = $('#edit-due-date-modal');
            if (modal.length) {
                ko.cleanNode(modal[0]);
                modal.remove();
            }
            $template.remove();
        });

        it("will display a modal and save the updated due date via the report service", function () {
            spyOn($.fn, 'modal').and.callFake(function () {
                return this;
            });
            spyOn($.fn, 'validationEngine').and.returnValue(true);

            var ajaxOptions;
            spyOn($, 'ajax').and.callFake(function (options) {
                ajaxOptions = options;
                return $.Deferred().resolve({success: true});
            });

            var viewModel = new ReportViewModel(report, config);
            spyOn(viewModel, 'reloadPage');
            viewModel.editDueDate();

            var $modal = $('#edit-due-date-modal');
            expect($modal.length).toBe(1);
            expect($modal.find('.report-name').text()).toEqual('Report 1');

            // Simulate the user selecting a new due date then clicking save.
            $modal.find('input').val('31-08-2020').trigger('change');
            $modal.find('button.save').click();

            expect(ajaxOptions.url).toEqual('/project/ajaxUpdateReportDueDate/p1');
            expect(ajaxOptions.type).toEqual('POST');

            var payload = JSON.parse(ajaxOptions.data);
            expect(payload.reportId).toEqual('r1');
            expect(payload.dueDate).not.toEqual('2020-07-31T14:00:00Z');

            // The report displayed in the reports table should be updated with the new due date.
            expect(viewModel.dueDate()).toEqual(payload.dueDate);
            expect(viewModel.dueDate.formattedDate()).toEqual('31-08-2020');
            expect(viewModel.reloadPage).toHaveBeenCalled();
        });
    });
});
