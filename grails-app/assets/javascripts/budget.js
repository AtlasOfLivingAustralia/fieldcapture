var BudgetConstants = {
    PERIODICALLY_REVISED_TOTAL : 'periodicallyRevisedTotal',
    PERIODIC_TOTAL : 'perPeriodBreakdown'
};

function BudgetViewModel(o, period) {
    var self = this;
    if (!o) o = {};

    self.overallTotal = ko.observable(0.0);

    var headerArr = [];
    for (i = 0; i < period.length; i++) {
        headerArr.push({"data": period[i]});
    }
    self.headers = ko.observableArray(headerArr);

    var row = [];
    o.rows ? row = o.rows : row.push(ko.mapping.toJS(new BudgetRowViewModel({}, period)));
    self.rows = ko.observableArray($.map(row, function (obj, i) {
        // Headers don't match with previously stored headers, adjust rows accordingly.
        if (o.headers && period && o.headers.length != period.length) {
            var updatedRow = [];
            for (i = 0; i < period.length; i++) {
                var index = -1;

                for (j = 0; j < o.headers.length; j++) {
                    if (period[i] == o.headers[j].data) {
                        index = j;
                        break;
                    }
                }
                updatedRow.push(index != -1 ? obj.costs[index] : 0.0)
                index = -1;
            }
            obj.costs = updatedRow;
        }

        return new BudgetRowViewModel(obj, period);
    }));

    self.overallTotal = ko.computed(function () {
        var total = 0.0;
        ko.utils.arrayForEach(this.rows(), function (row) {
            if (row.rowTotal()) {
                total += parseFloat(row.rowTotal());
            }
        });
        return total;
    }, this).extend({currency: {}});

    var allBudgetTotal = [];
    for (i = 0; i < period.length; i++) {
        allBudgetTotal.push(new BudgetTotalViewModel(this.rows, i));
    }
    self.columnTotal = ko.observableArray(allBudgetTotal);

    self.addRow = function () {
        self.rows.push(new BudgetRowViewModel({}, period));
    }
};

function BudgetTotalViewModel(rows, index) {
    var self = this;
    self.data = ko.computed(function () {
        var total = 0.0;
        ko.utils.arrayForEach(rows(), function (row) {
            if (row.costs()[index]) {
                total += parseFloat(row.costs()[index].dollar());
            }
        });
        return total;
    }, this).extend({currency: {}});
};


function BudgetRowViewModel(o, period) {
    var self = this;


    if (!o) o = {};
    if (!o.activities || !_.isArray(o.activities)) o.activities = [];
    self.shortLabel = ko.observable(o.shortLabel);
    self.description = ko.observable(o.description);
    self.activities = ko.observableArray(o.activities);
    self.type = o.type || BudgetConstants.PERIODIC_TOTAL;


    var arr = [];
    // Have at least one period to record, which will essentially be a project total.
    var minPeriods = _.max([1, period.length]);
    for (var i = 0; i < minPeriods; i++) {
        arr.push(ko.mapping.toJS(new FloatViewModel()));
    }

    if (o.costs && o.costs.length != arr.length) {
        o.costs = arr;
    }
    o.costs ? arr = o.costs : arr;
    self.costs = ko.observableArray($.map(arr, function (obj, i) {
        return new FloatViewModel(obj);
    }));

    self.rowTotal = ko.computed(function () {
        var total = 0.0;
        // The Periodically Revised Total is a special case used by the IPPRS system whereby each year they
        // revise the total contract value.  For this case, the rowTotal is determined by starting in the
        // current year and working backwards until a non-zero value is found.
        if (self.type === BudgetConstants.PERIODICALLY_REVISED_TOTAL) {
            var currentDateString = convertToIsoDate(new Date());
            var i = 0;

            // Find the current period.
            while (i<period.length-1 && period[i].value <= currentDateString) {
                i++;
            }
            total = parseFloat(self.costs()[i].dollar());
            while (i>0 && (isNaN(total) || total == 0)) {
                i--;
                total = parseFloat(self.costs()[i].dollar());
            }
        }
        else { //self.type === PERIODIC_TOTAL is the default - i.e. the default behaviour is to sum the columns
            ko.utils.arrayForEach(this.costs(), function (cost) {
                if (cost.dollar())
                    total += parseFloat(cost.dollar());
            });
        }

        return total;
    }, this).extend({currency: {}});
};

function FloatViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.dollar = ko.observable(o.dollar ? o.dollar : 0.0).extend({numericString: 2}).extend({currency: {}});
};