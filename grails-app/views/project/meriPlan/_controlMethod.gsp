<div class="meri-control-method">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table control-method">
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
            <tbody data-bind="foreach : details.threatControlMethod.rows">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <td class="method-current">
                    <textarea class="form-control form-control-sm" data-bind="value: currentControlMethod, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
                </td>
                <td class="method-success">
                    <select class="form-control form-control-sm" style="width: 60%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.controls, value:hasBeenSuccessful,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                <td class="method-type">
                    <select class="form-control form-control-sm" style="width: 60%;" data-bind="addValueToOptionsIfMissing:true, options: $parent.methodType, value:methodType,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                </td>
                <td class="method-details">
                    <textarea class="form-control form-control-sm" data-bind="value: details, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea>
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
