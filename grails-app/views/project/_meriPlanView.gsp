<div id="view-meri-plan" data-bind="let:{details:meriPlan()}">
    <style type="text/css">
    .announcements th {
        white-space: normal;
    }
    </style>

    <div data-bind="ifnot: details.status() == 'active'">
        <h4>MERI Plan not available.</h4>
    </div>

    <div data-bind="if: details.status() == 'active'">
        <span style="float:right;" data-bind="if:detailsLastUpdated">Last update date : <span
                data-bind="text:detailsLastUpdated.formattedDate"></span></span>

        <h3>MERI Plan Information</h3>

        <div class="row-fluid space-after">
            <div class="span6">
                <div id="project-objectives" class="well well-small">
                    <label><b>Project Outcomes:</b></label>
                    <table style="width: 100%;">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Outcomes</th>
                            <th>Asset(s) addressed</th>
                        </tr>
                        </thead>
                        <tbody data-bind="foreach : details.objectives.rows1">
                        <tr>
                            <td><span data-bind="text: $index()+1"></span></td>
                            <td><span data-bind="text:description"></span></td>
                            <td><label data-bind="text:assets"></label></td>
                        </tr>
                        </tbody>
                    </table>

                    <g:render template="meriPlanReadOnly/monitoringIndicators"/>
                </div>
            </div>

            <div class="span6">
                <g:render template="meriPlanReadOnly/projectPartnerships"/>
            </div>
        </div>

        <div class="row-fluid space-after">
            <div class="span6">
                <g:render template="meriPlanReadOnly/projectImplementation"/>
            </div>

            <div class="span6">

            </div>
        </div>


        <g:if test="${announcementsVisible && user?.isAdmin}">
            <div class="row-fluid space-after">
                <div class="well well-small">
                    <div id="project-keq" class="announcements well well-small">
                        <label><b>Projects Announcements</b></label>
                        <table style="width: 100%; ">
                            <thead>
                            <tr>
                                <th></th>
                                <th><g:message code="announcements.type"/></th>
                                <th><g:message code="announcements.name"/></th>
                                <th><g:message code="announcements.scheduledDate"/>/th>
                                <th><g:message code="announcements.when"/></th>
                                <th><g:message code="announcements.funding"/></th>
                                <th><g:message code="announcements.description"/></th>
                            </tr>
                            </thead>
                            <tbody data-bind="foreach : details.events">
                            <tr>
                                <td><span data-bind="text: $index()+1"></span></td>
                                <td width="12%"><span data-bind="text:type"></span></td>
                                <td width="18%"><span data-bind="text: name"></span></td>
                                <td width="12%"><span data-bind="text:scheduledDate.formattedDate"></span></td>
                                <td width="12%"><span data-bind="text:grantAnnouncementDate"></span></td>
                                <td width="12%"><span data-bind="text:funding"></span></td>
                                <td width="28%"><span data-bind="text: description"></span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </g:if>

        <div class="row-fluid space-after">
            <g:render template="meriPlanReadOnly/keq"/>
        </div>

        <div class="row-fluid space-after">
            <div id="national-priorities" class="well well-small">
                <label><b>National and regional priorities:</b></label>
                <table style="width: 100%;">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Document name</th>
                        <th>Relevant section</th>
                        <th>Explanation of strategic alignment</th>
                    </tr>
                    </thead>
                    <tbody data-bind="foreach : details.priorities.rows">
                    <tr>
                        <td><span data-bind="text: $index()+1"></span></td>
                        <td><span data-bind="text: data1"></span></td>
                        <td><label data-bind="text: data2"></label></td>
                        <td><label data-bind="text: data3"></label></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <g:if test="${user?.isAdmin}">
            <div class="row-fluid space-after">
                <div class="required">
                    <g:render template="meriPlanReadOnly/meriBudget"/>
                </div>
            </div>
        </g:if>

        <g:if test="${risksAndThreatsVisible}">
            <g:render template="risksAndThreatsReadOnly"/>
        </g:if>


        <div class="row-fluid space-after">
            <div class="span6">
                <div class="well well-small">
                    <label><b>Workplace Health and Safety</b></label>

                    <div>1. Are you aware of, and compliant with, your workplace health and safety legislation and obligations: <b><span
                            data-bind="text: details.obligations"></span></b></div>

                    <div>2. Do you have appropriate policies and procedures in place that are commensurate with your project activities: <b><span
                            data-bind="text: details.policies"></span></b></div>
                </div>
            </div>

            <div class="span6">
                <div class="well well-small">
                    <span><b>&nbsp;Are you willing for your project to be used as a case study by the Department?</b>
                    </span>
                    <input class="pull-left" type="checkbox" data-bind="checked: details.caseStudy, disable: true"/>
                </div>
            </div>
        </div>

    </div>
</div>