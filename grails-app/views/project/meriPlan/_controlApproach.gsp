<div class="meri-control-approach">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table control-approach-threat">
            <thead>
            <tr>
                <th class="approach-current">${approachHeading}</th>
                <th class="approach-details">${detailHeading}</th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.threatToNativeSpecies.rows">
            <tr>
                <td class="approach-current">
                    <select class="form-control form-control-sm" style="width: 30%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.controls, value:couldBethreatToSpecies,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                    <td class="approach-details">
                        <textarea class="form-control form-control-sm" data-bind="value: details, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
                    </td>
            </tr>
            </tbody>
        </table>
</div>
