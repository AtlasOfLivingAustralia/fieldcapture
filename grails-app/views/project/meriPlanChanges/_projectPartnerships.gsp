<div id="project-partnership-view" class="well well-small">
    <h4>${title ?: 'Project partnerships'}</h4>
    <table class="table" id="project-partnerships">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="partner-name">${partnerNameHeading ?: 'Partner name'}</th>
            <th class="partnership-nature">${naturePartnershipHeading ?: 'Nature of partnership'}</th>
            <th class="partner-organisation-type">${typeOrganisationHeading ?: 'Type of organisation'}</th>
        </tr>
        </thead>
        <tbody>
        <g:set var="max" value="${Math.max(project.custom.details.partnership.rows.size(), changed.custom.details.partnership?.rows?.size()?:0)}"/>
        <g:each in="${(0..<max)}" var="i">
            <tr>
                <td class="index"><span data-bind="text:${i}+1"></span></td>
                <td class="partner-name"><fc:renderComparison changed="${changed.custom.details.partnership.rows ?: []}" i="${i}" original="${project.custom.details.partnership.rows ?: []}" property="data1"/> </td>
                <td class="partnership-nature"><fc:renderComparison changed="${changed.custom.details.partnership.rows ?: []}" i="${i}" original="${project.custom.details.partnership.rows ?: []}" property="data2"/> </td>
                <td class="partner-organisation-type"><fc:renderComparison changed="${changed.custom.details.partnership.rows ?: []}" i="${i}" original="${project.custom.details.partnership.rows ?: []}" property="data3"/> </td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>
