<div class="meri-plan space-after"  data-bind="let:{details:meriPlan()}">
    <g:render template="/project/meriPlan/programOutcome"/>

    <g:render template="/project/meriPlan/additionalOutcomes"/>

    <g:render template="/project/meriPlan/outcomeStatements" model="${[
            outcomeType:'short',
            minimumNumberOfOutcomes:1,
            title:"Project outcomes",
            subtitle:'Short-term outcome statement/s',
            helpText:'Short-term outcomes should contribute to the 5-year Outcome and outline the degree of impact having undertaken the Services for up to 3 years. Short-term outcomes should be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime. Please note: for Projects three years or less in duration, a short-term Project outcome achievable at the Project’s completion must be set.']}"/>

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
                    <td><input type="text" class="form-control form-control-sm" data-validation-engine="validate[required,maxSize[150]]" data-bind="value:details.name, disable: isProjectDetailsLocked()"></td>
                </tr>
                <tr class="header required">
                    <th class="required">Project description (1000 character limit [approx. 150 words]) <fc:iconHelp>Project description will be visible on project overview page in MERIT.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5"  class="form-control form-control-sm" data-validation-engine="validate[required,maxSize[1500]]" data-bind="value:details.description, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>

                <!-- ko if:isAgricultureProject() -->
                <tr class="header">
                    <th class="required">Project rationale (3000 character limit [approx 500 words]) <fc:iconHelp>Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[4000]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()"></textarea></td>
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
                <textarea class="form-control form-control-sm" rows="4" data-validation-engine="validate[required]"
                          data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="baseline-method"><textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                    data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                    rows="4"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() > 1 && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
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
