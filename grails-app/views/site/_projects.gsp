<g:if test="${site.projects}">
    <div>
        <h2>Projects associated with this site</h2>
        <ul style="list-style: none;margin:13px 0;">
            <g:each in="${site.projects}" var="p" status="count">
                <li>
                    <g:link controller="project" action="index" id="${p.projectId}">${p.name?.encodeAsHTML()}</g:link>
                    <g:if test="${count < site.projects.size() - 1}">, </g:if>
                </li>
            </g:each>
        </ul>
    </div>
</g:if>