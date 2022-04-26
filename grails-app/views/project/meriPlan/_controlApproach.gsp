<div class="meri-monitoring-indicators">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table">
            <thead>
            <tr>
                <th class="index"></th>
                    <th class="baseline">${approachHeading}</th>
                    <th class="baseline-method">${detailHeading}</th>
                <th class="remove"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.controlApproach.rows">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <td class="baseline">
                    <select class="form-control form-control-sm" style="width: 30%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.controls, value:data1,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                    <td class="baseline-method">
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
