<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table methodology">
    <thead>
    <tr class="header required">
        <th class="required">Project methodology (4000 character limit [approx 650 words]) <fc:iconHelp>Describe the methodology that will be used to achieve the project outcomes. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification, and any assumptions).</fc:iconHelp></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><textarea rows="5" data-validation-engine="validate[required,maxSize[5000]]" data-bind="value:details.implementation.description, disable: isProjectDetailsLocked()"></textarea></td>
    </tr>
    </tbody>
</table>