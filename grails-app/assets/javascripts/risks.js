function Risks(risks, riskModel, disableFlag, key) {
    var self = this;

    if (key) {
        var savedRisks = amplify.store(key);
        if (savedRisks) {
            var restored = JSON.parse(savedRisks);
            if (restored.risks) {
                $('#restoredRiskData').show();
                risks = restored.risks;
            }
        }
    }

    self.risksDisabled = disableFlag;

    self.addRisks = function(){
        self.risks.rows.push(new RisksRowViewModel({}, riskModel));
    };
    self.removeRisk = function(risk) {
        self.risks.rows.remove(risk);
    };

    self.likelihoodOptions = riskModel.likelihoodOptions;
    self.consequenceOptions = riskModel.consequenceOptions;
    self.ratingOptions = riskModel.ratingOptions;

    self.overAllRiskHighlight = ko.computed(function () {
        var val = '';
        if (self.risks) {
            val = self.risks.overallRisk();
        }
        return getClassName(val);
    });


    self.saveRisks = function(){
        if (!$('#risk-validation').validationEngine('validate'))
            return;
        self.risks.saveWithErrorDetection(function() {location.reload();});
    };

    self.loadRisks = function(risks) {
        self.risks = new RisksViewModel(risks, riskModel);
    };

    self.loadRisks(risks);


};

function RisksViewModel (risks, riskModel) {
    var self = this;
    self.overallRisk = ko.observable();
    self.status = ko.observable();
    self.rows = ko.observableArray();

    self.load = function(risks) {
        if (!risks) {
            risks = {};
        }
        self.overallRisk(orBlank(risks.overallRisk));
        self.status(orBlank(risks.status));
        if (risks.rows) {
            self.rows($.map(risks.rows, function (obj) {
                return new RisksRowViewModel(obj, riskModel);
            }));
        }
        else {
            self.rows.push(new RisksRowViewModel({}, riskModel));
        }
    };
    self.modelAsJSON = function() {
        var tmp = {};
        tmp = ko.mapping.toJS(self);
        tmp['status'] = 'active';
        var jsData = {"risks": tmp};
        var json = JSON.stringify(jsData, function (key, value) {
            return value === undefined ? "" : value;
        });
        return json;
    };
    self.load(risks);
};

function RisksRowViewModel (risksRow, riskModel) {
    var self = this;
    if(!risksRow) risksRow = {};
    self.threat = ko.observable(risksRow.threat);
    self.description = ko.observable(risksRow.description);
    self.likelihood = ko.observable(risksRow.likelihood);
    self.consequence = ko.observable(risksRow.consequence);
    self.currentControl = ko.observable(risksRow.currentControl);
    self.residualRisk = ko.observable(risksRow.residualRisk);
    self.riskRating = ko.computed(function (){
        if (self.likelihood() && self.consequence()) {
            return riskModel.riskRating(self.likelihood(), self.consequence());
        }
    }, this);
};

function getClassName(val){
    var className = '';
    if(val == 'High')
        className = 'badge badge-important';
    else if (val == 'Significant')
        className = 'badge badge-warning';
    else if (val == 'Medium')
        className = 'badge badge-info';
    else if (val == 'Low')
        className = 'badge badge-success';
    return className;
}

var RiskModel = function(likelihoodOptions, consequenceOptions, ratingOptions, riskRatingMatrix) {

    var self = this;
    self.likelihoodOptions = likelihoodOptions;
    self.consequenceOptions = consequenceOptions;
    self.ratingOptions = ratingOptions;
    self.riskRatingMatrix = riskRatingMatrix;

    self.riskRating = function(likelyhood, consequence) {
        var row = _.indexOf(self.likelihoodOptions, likelyhood);
        var column = _.indexOf(self.consequenceOptions, consequence);

        if (row >= 0 && column >=0) {
            return riskRatingMatrix[row][column];
        }
        return '';

    }
};

var meritRiskModel = function() {

    var likelihoodOptions = ['Almost Certain', 'Likely', 'Possible', 'Unlikely', 'Remote'];
    var consequenceOptions = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Extreme'];
    var ratingOptions = ['High', 'Significant', 'Medium', 'Low'];

    var riskRatingMatrix = [
        ["Medium", "Significant", "High",        "High",        "High"],
        ["Low",    "Medium",      "Significant", "High",        "High"],
        ["Low",    "Medium",      "Medium",      "Significant", "High"],
        ["Low",    "Low",         "Medium",      "Medium",      "Significant"],
        ["Low",    "Low",         "Low",         "Medium",      "Medium"]
    ];

    return new RiskModel(likelihoodOptions, consequenceOptions, ratingOptions, riskRatingMatrix);
};

var rlpRiskModel = function() {
    var likelihoodOptions = ['Highly Likely', 'Likely', 'Possible', 'Unlikely', 'Rare'];
    var consequenceOptions = ['Minor', 'Moderate', 'High', 'Major', 'Critical'];
    var ratingOptions = ['Severe', 'High', 'Medium', 'Low'];

    var riskRatingMatrix = [
        ["Medium", "High",   "High",   "Severe", "Severe"],
        ["Low",    "Medium", "High",   "High",   "Severe"],
        ["Low",    "Medium", "Medium", "High",   "Severe"],
        ["Low",    "Low",    "Medium", "High",   "High"],
        ["Low",    "Low",    "Low",    "Medium", "High"]
    ];

    return new RiskModel(likelihoodOptions, consequenceOptions, ratingOptions, riskRatingMatrix);
};