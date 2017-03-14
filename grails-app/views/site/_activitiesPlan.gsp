
<g:render template="/shared/activitiesByStage"/>

<script id="stageNotReportableTmpl" type="text/html">
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
            if (planViewModel.stages) {
                for (var i=0; i<planViewModel.stages.length; i++) {
                    planViewModel.stages[i].stageStatusTemplateName = 'stageNotReportableTmpl'; // Disable reporting options.
                }
            }

            ko.applyBindings(planViewModel, document.getElementById('activities-plan'));

            // the following draws the gantt chart
            planViewModel.refreshGantChart();

    });

</r:script>
