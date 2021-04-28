
    <div class="row">
        <span class="ml-3 col-sm-12 report"><h4>Report: </h4>
            <select id="dashboardType" name="dashboardType" class="mb-2 form-control form-control-sm">
                <g:each in="${reports}" var="report">
                    <option value="${report.name}">${report.label}</option>
                </g:each>
            </select>
        </span>
    </div>
    <div class="loading-message">
        <asset:image src="loading.gif" alt="saving icon"/> Loading...
    </div>
    <div id="dashboard-content">

    </div>

