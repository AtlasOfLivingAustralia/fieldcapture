
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
            var reports = <fc:modelAsJavascript model="${reports}"/>;
            var userIsEditor = ${user?.isEditor?'true':'false'};
            var project = <fc:modelAsJavascript model="${project}"/>;
            var activities = <fc:modelAsJavascript model="${activities}"/>;
            var scores = ${scores as grails.converters.JSON};
            var siteId = '${site.siteId}';

            var config = {
                rejectionCategories: ['Minor', 'Moderate', 'Major'],
                saveTargetsUrl:fcConfig.projectUpdateUrl,
                showEmptyStages:false,
                defaultSiteId: siteId,
                activityDisplayFilter : function(activity) { return activity.siteId === siteId },
                saveTargetsUrl: "${createLink(controller:'project', action: 'ajaxUpdate', id: project.projectId)}"
            };
            var planViewModel = new PlanViewModel(
                activities || [],
                reports,
                project.outputTargets,
                scores,
                project,
                today,
                config,
                userIsEditor
            );


            ko.applyBindings(planViewModel, document.getElementById('activities-plan'));

            // the following draws the gantt chart
            planViewModel.refreshGantChart();

    });

</r:script>
