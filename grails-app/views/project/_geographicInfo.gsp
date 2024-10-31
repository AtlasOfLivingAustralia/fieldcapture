<g:if test="${fc.userIsSiteAdmin()}">
    <g:if test="${project.primarystate || project.primaryelect}">
        <h4>Geographic range</h4>
        <div class="row">
            <div class="col-sm-10">
                <table class="table">
                    <tbody>
                    <g:if test="${project.primarystate}">
                    <tr>
                        <th>Primary State</th>
                        <td>${project.primarystate}</td>
                    </tr>
                    <tr>
                        <th>Other State(s)</th>
                        <td>${project.otherstate}</td>
                    </tr>
                    </g:if>
                    <g:if test="${project.primaryelect}">
                    <tr>
                        <th>Primary Electorate</th>
                        <td>${project.primaryelect}</td>
                    </tr>
                    <tr>
                        <th>Other Electorate(s)</th>
                        <td>${project.otherelect}</td>
                    </tr>
                    </g:if>
                    </tbody>
                </table>
            </div>
        </div>
    </g:if>
</g:if>
