<div class="meri-control-approach">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table control-approach-threat">
            <thead>
            <tr>
                <th class="index"></th>
                    <th class="approach-current">${approachHeading}</th>
                    <th class="approach-details">${detailHeading}</th>
                <th class="remove"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.controlApproach.rows">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <td class="approach-current">
                    <select class="form-control form-control-sm" style="width: 30%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.controls, value:data1,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                    <td class="approach-details">
                        <textarea class="form-control form-control-sm" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
                    </td>
                <td class="remove">
                    <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove" data-bind="click: $parent.removeControl"></i></span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="5">
                    <button type="button" class="btn btn-sm" data-bind="disable:isProjectDetailsLocked(), click: addControl">
                        <i class="fa fa-plus"></i> Add a row</button>
                </td>
            </tr>
            </tfoot>
        </table>
</div>
