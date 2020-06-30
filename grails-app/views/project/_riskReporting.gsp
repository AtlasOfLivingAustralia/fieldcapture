<!-- ko stopBinding:true -->
<div id="risk-changes-report">
    <h4>Changes to risks and threats</h4>

    <p>Select the date range over which to view the changes to the project risks and threats then press "Generate Report (PDF)" button</p>
    <hr/>

    <form class="form-horizontal" id="risks-changes-report">
        <div class="control-group">
            <label class="control-label" for="risks-changes-from-date">From date (baseline for comparison):</label>

            <div class="controls">
                <div class="input-append">
                <fc:datePicker class="input-small" id="risks-changes-from-date" targetField="fromDate.date"></fc:datePicker>
                </div>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="risks-changes-to-date">To date:</label>

            <div class="controls">
                <div class="input-append">
                <fc:datePicker id="risks-changes-to-date" class="input-small" targetField="toDate.date"></fc:datePicker>
                </div>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label">PDF Orientation: <fc:iconHelp>If your PDF includes activities with wide tables, the Landscape setting may improve the result.  This setting has no effect on the HTML view.</fc:iconHelp></label>

            <div class="controls">
                <select data-bind="value:orientation">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </div>
        </div>
    </form>

    <div class="control-group">
        <button type="button" class="btn btn-success"
                data-bind="click:generateRisksReportHTML">Generate Report (HTML)</button>
        <button type="button" class="btn btn-success"
                data-bind="click:generateRisksReportPDF">Generate Report (PDF)</button>
    </div>

</div>
<!-- /ko -->