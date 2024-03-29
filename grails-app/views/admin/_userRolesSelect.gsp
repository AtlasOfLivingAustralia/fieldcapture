<select name="role" id="addUserRole" class="validate[required] form-control form-control-sm ${selectClass}" data-errormessage-value-missing="Role is required!" <g:if test="${hide}">style="display:none;"</g:if>>
    <g:if test="${includeEmptyOption}"><option value="">-- select a permission level --</option></g:if>
    <g:set var="userIsSiteAdmin"><fc:userIsSiteAdmin /></g:set>
    <g:each var="role" in="${roles}">
            <g:set var="disabledHtml" value='disabled="disabled" class="tooltips" title="Only ADMIN users can set Case Manager role"'/>
            <g:set var="disabled" value="${(role == 'caseManager' && !userIsSiteAdmin) ? disabledHtml : ''}" />
        <g:if test="${hubFlg}">
            <option value="${role}" ${disabled}><g:message code="label.hubRole.${role}" default="${role}"/></option>
        </g:if>
        <g:else>
            <option value="${role}" ${disabled}><g:message code="label.role.${role}" default="${role}"/></option>
        </g:else>
    </g:each>
</select>
