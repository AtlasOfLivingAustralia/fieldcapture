ko.components.register('report-status', {
    viewModel: function (params) {
        var self = this;
        self.statusLabel = params.reportStatus;
        var labelNamespace = 'report.status.';
        if (params.reportType && params.reportType != '') {
            labelNamespace += params.reportType + '.';
        }
        var status = params.reportStatus || '';
        $i18nAsync(labelNamespace+status, null, function(value) {
            self.statusLabel = value || '';
        });
        self.badgeClass = '';
        switch(params.reportStatus) {
            case PublicationStatus.PUBLISHED:
                self.badgeClass = 'badge-success';
                break;
            case PublicationStatus.SUBMITTED:
                self.badgeClass = 'badge-warning';
                break;
            case PublicationStatus.CANCELLED:
                self.badgeClass = 'badge-danger';
            default:
                self.badgeClass = '';
        }
    },
    template: componentService.getTemplate('report-status')
});