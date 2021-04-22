<div class="meri-plan"  data-bind="let:{details:meriPlan()}">
    <g:render template="/project/meriPlan/programOutcome"/>

    <g:render template="/project/meriPlan/additionalOutcomes"/>

    <h4>Project outcomes</h4>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome required">Short-term outcome statement/s <fc:iconHelp html="true" container="body">Short-term outcomes should:
                <ul>
                    <li>Contribute to the 5-year Outcome (e.g. what degree of impact you are expecting from this Project’s interventions).</li>
                    <li>Outline the degree of impact having undertaken the Services for up to 3 years, for example "area of relevant vegetation type has increased".</li>
                    <li>Be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li>
                </ul>
                <b>Please note: </b>for Projects three years or less in duration, a short-term Project outcome achievable at the Project’s completion must be set.
            </fc:iconHelp> </th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome">
                <textarea class="form-control" data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
            </td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                       data-bind="click: $parent.removeShortTermOutcome"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3">
                <button type="button" class="btn btn-sm"
                        data-bind="disable: isProjectDetailsLocked(), click: addShortTermOutcome">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <g:render template="/project/meriPlan/mediumTermOutcomes"/>

    <h4>Project details</h4>
    <div class="row">
        <div class="col-sm-12">
            <table class="table">
                <tbody>

                <tr class="header required">
                    <th class="required">Project name (150 characters) <fc:iconHelp>The project name will be visible on project overview page in MERIT</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><input type="text"  class="form-control" data-validation-engine="validate[required,maxSize[150]]" data-bind="value:details.name, disable: isProjectDetailsLocked()"></td>
                </tr>
                <tr class="header required">
                    <th class="required">Project description (1000 character limit [approx. 150 words]) <fc:iconHelp>Project description will be visible on project overview page in MERIT.</fc:iconHelp></th>
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

    <!-- ko if:!isAgricultureProject() -->
    <g:render template="/project/meriPlan/keyThreats"/>
    <!-- /ko -->

    <g:render template="/project/meriPlan/projectMethodology" model="${[tableHeading:'Project methodology (4000 character limit [approx 650 words])', helpText:"Describe the methodology that will be used to achieve the project outcomes. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification, and any assumptions)."]}"/>

    <g:render template="/project/meriPlan/monitoringBaseline"/>

    <table class="table monitoring">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline required">Project monitoring indicators</th>
            <th class="baseline-method required">Describe the project monitoring indicator approach</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <textarea class="form-control" rows="4" data-validation-engine="validate[required]"
                          data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="baseline-method"><textarea class="form-control" data-validation-engine="validate[required]"
                    data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                    rows="4"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() > 1 && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                       data-bind="click: $parent.removeKEQ"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button type="button" class="btn btn-sm"
                        data-bind="disable: isProjectDetailsLocked(), click: addKEQ">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <g:render template="/project/meriPlan/projectReview"/>

    <g:render template="/project/meriPlan/nationalAndRegionalPlans"/>

    <div class="row">
        <div class="col-sm-12">
            <g:render template="/project/meriPlan/serviceTargets"/>
        </div>
    </div>

    <h4>MERI Attachments</h4>
    <p>
        Please attach programme logic to your MERI plan using the documents function on the Admin tab.  A "Document type" of "Programme Logic" should be selected when uploading the document.
    </p>

    <g:render template="/shared/declaration" model="[divId:'meriSubmissionDeclaration', declarationType:au.org.ala.merit.SettingPageType.RLP_MERI_DECLARATION]"/>
</div>
