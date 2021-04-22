<h4>Project details</h4>
<div class="row">
    <div class="col-sm-12">
        <table class="table">
            <tbody>

            <tr class="header required">
                <th class="required">Project name (150 characters) <fc:iconHelp>"${helpTextProjectName ?:"The project name will be visible on project overview page in MERIT"}"</fc:iconHelp></th>
            </tr>
            <tr>
                <td><input type="text" class="form-control form-control-sm" data-validation-engine="validate[required,maxSize[150]]" data-bind="value:details.name, disable: isProjectDetailsLocked()"></td>
            </tr>
            <tr class="header required">
                <th class="required">Project description (1000 character limit [approx. 150 words]) <fc:iconHelp>"${helpTextHeading ?:'Project description will be visible on project overview page in MERIT.'}"</fc:iconHelp></th>
            </tr>
            <tr>
                <td><textarea rows="5"  class="form-control" data-validation-engine="validate[required,maxSize[1500]]" data-bind="value:details.description, disable: isProjectDetailsLocked()"></textarea></td>
            </tr>

                <!-- ko if:isAgricultureProject() -->
                <tr class="header">
                    <th class="required">Project rationale (3000 character limit [approx 500 words]) <fc:iconHelp>Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea class="form-control" rows="5" data-validation-engine="validate[required,maxSize[4000]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <!-- /ko -->

            </tbody>
        </table>
    </div>
</div>
