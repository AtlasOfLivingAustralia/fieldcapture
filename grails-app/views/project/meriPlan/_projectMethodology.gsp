<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table methodology">
    <thead>
    <tr class="header required">
        <th class="required">${tableHeading}<g:if test="${helpText}"><fc:iconHelp>${helpText}</fc:iconHelp></g:if></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><textarea placeholder="${placeHolder}" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:5000}]]" data-bind="value:details.implementation.description, disable: isProjectDetailsLocked()"></textarea></td>
    </tr>
    </tbody>
</table>