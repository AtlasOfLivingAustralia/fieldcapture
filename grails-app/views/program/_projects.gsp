<g:if test="${projects}">
    <table id="projectList" class="table table-striped">
        <thead>
            <td>Name</td>
        </thead>
        <tbody>
            <g:each var="project" in="${projects}">
                <tr>
                <td><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.name}</a></td>
                </tr>
            </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row-fluid">
        <span class="span12"><h4>${program.name} is not currently running any projects.</h4></span>
    </div>
</g:else>