<table class="table">
    <thead>
    <tr class="header required">
        <th class="required">${title?: "Project Review, Evaluation and Improvement Methodology and Approach (3000 character limit [approx 500 words])"} <fc:iconHelp>${helpText?: "Outline the methods and processes that will enable adaptive management during this project."}</fc:iconHelp></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[4000]]" data-bind="value:details.projectEvaluationApproach, disable: isProjectDetailsLocked()"></textarea></td>
    </tr>
    </tbody>
</table>
