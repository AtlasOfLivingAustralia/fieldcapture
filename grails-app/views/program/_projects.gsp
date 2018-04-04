<g:if test="${program.projects}">
    <table id="projectList" class="table table-striped">
        <thead>
            <td>Name</td>
        </thead>
        <tbody>
            <g:each var="project" in="${program.projects}">
            <td>${project.name}</td>
            </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row-fluid">
        <span class="span12"><h4>${program.name} is not currently running any projects.</h4></span>
    </div>
</g:else>