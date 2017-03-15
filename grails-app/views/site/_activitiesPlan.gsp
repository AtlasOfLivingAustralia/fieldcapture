
<g:render template="/shared/activitiesByStage"/>

<script id="stageNotReportableTmpl" type="text/html">
</script>


<script id="stageNotApprovedTmpl" type="text/html">
<span class="badge badge-warning">Report not submitted</span>
</script>

<script id="stageApprovedTmpl" type="text/html">
<span class="badge badge-success">Report Approved</span>
</script>

<script id="stageSubmittedTmpl" type="text/html">
<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
</script>



<script id="stageSubmittedVariationTmpl" type="text/html">

<span class="badge badge-info" style="font-size:13px;">Report submitted</span>

</script>


<r:script>

$(function() {


var today = '${today}';
            var programModel = <fc:modelAsJavascript model="${programs}"/>;
            var reports = <fc:modelAsJavascript model="${reports}"/>;
            var userIsEditor = ${user?.isEditor?'true':'false'};
            var project = <fc:modelAsJavascript model="${project}"/>;
            var activities = <fc:modelAsJavascript model="${activities}"/>;
            var scores = ${scores as grails.converters.JSON};
            var planViewModel = new PlanViewModel(
                activities || [],
                reports,
                project.outputTargets,
                scores,
                project,
                programModel,
                today,
                {rejectionCategories: ['Minor', 'Moderate', 'Major'], saveTargetsUrl:fcConfig.projectUpdateUrl, showEmptyStages:false, defaultSiteId: '${site.siteId}' },
                userIsEditor
            );


            ko.applyBindings(planViewModel, document.getElementById('activities-plan'));

            // the following draws the gantt chart
            planViewModel.refreshGantChart();

    });

</r:script>
