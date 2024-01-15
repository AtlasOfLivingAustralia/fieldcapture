<g:if test="${project.lock?.userId == user.userId}">
    <div class="row space-after">
        <div class="col-sm-12 pl-3 pr-3">
            <div class="alert alert-danger meri-lock-held">
                <p class="text-dark"><i class="fa fa-lock"></i> You currently hold an editing lock for this MERI plan.  No other users will be able to edit the plan until you release the lock using "Save changes and finish editing", "Submit for approval", or "Cancel" buttons.</p>
            </div>
        </div>
        <div class="col-sm-12">
            <div class="form-actions">

                <div class="form-check ml-2 mb-2">
                    <input type="checkbox" class="form-check-input" id="caseStudy" data-bind="checked: meriPlan().caseStudy, disable: isProjectDetailsLocked()">
                    <label for="caseStudy" class="form-check-label">Are you willing for your project to be used as a case study by the Department?</label>
                </div>
                <br/>

                <div class="alert alert-secondary form-check">
                    <label for="planFinished" class="ml-2 form-check-label"><input type="checkbox" class="form-check-input" id="planFinished" data-bind="checked: meriPlan().markAsFinished, disable: isProjectDetailsLocked()"> Mark the MERI plan as complete</label> <fc:iconHelp>The "Submit for approval" function will not be available until the MERI plan is marked as complete</fc:iconHelp>
                </div>
                <button type="button" data-bind="click: saveProjectDetails, disable: isProjectDetailsLocked()" class="btn btn-sm btn-primary">Save changes</button>
                <button type="button" data-bind="click: saveMeriPlanAndUnlock, disable: isProjectDetailsLocked()" class="btn btn-sm btn-primary">Save changes and finish editing</button>
                <button type="button" class="btn btn-sm btn-danger" data-bind="click: cancelProjectDetailsEdits">Cancel</button>


            <!--  Admin - submit to approval. -->
                <g:if test="${user?.isAdmin}">
                    <div>
                        <div data-bind="if: !isSubmittedOrApproved()">
                            <hr/>
                            <b>Admin actions:</b>
                            <g:if test="${showMERIActivityWarning}">
                                <ul>
                                    <li>You will not be able to report activity data until your MERI plan has been approved by your case manager.</li>
                                </ul>
                            </g:if>
                            <g:if test="${allowMeriPlanUpload}">
                                <div class="btn fileinput-button"
                                     data-bind="fileUploadNoImage:meriPlanUploadConfig"><i class="fa fa-plus"></i> <input
                                        type="file" name="meriPlan"><span>Upload MERI Plan</span></div>
                            </g:if>
                            <g:render template="submitMeriPlanButton"/>
                        </div>
                        <div data-bind="if: isSubmittedOrApproved()">
                            <g:if test="${showMERIActivityWarning}">
                                <hr/>

                                <b>Admin:</b>
                                <ul>
                                    <li>You will not be able to report activity data until your MERI plan has been approved by your case manager.</li>
                                </ul>
                            </g:if>
                        </div>
                    </div>
                </g:if>
            </div>

        </div>
    </div>
</g:if>