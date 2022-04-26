<div class="meri-monitoring-indicators">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table">
            <thead>
            <tr>
                <th class="index"></th>
                    <th class="method-current">${methodHeading}</th>
                    <th class="method-success">${successHeading}</th>
                    <th class="method-type">${typeHeading}</th>
                    <th class="method-details">${detailsHeading}</th>
                <th class="remove"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.controlMethod.rows">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <td class="method-current">
                    <textarea class="form-control form-control-sm" data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
                </td>
                <td class="method-success">
                    <select class="form-control form-control-sm" style="width: 60%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.controls, value:data2,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                <td class="method-type">
                    <select class="form-control form-control-sm" style="width: 60%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.methodType, value:data3,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                <td class="method-details">
                    <textarea class="form-control form-control-sm" data-bind="value: data4, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
                </td>
                <td class="remove">
                    <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove" data-bind="click: $parent.removeControlMethod"></i></span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="6">
                    <button type="button" class="btn btn-sm" data-bind="disable:isProjectDetailsLocked(), click: addControlMethod">
                        <i class="fa fa-plus"></i> Add a row</button>
                </td>
            </tr>
            </tfoot>
        </table>
</div>
