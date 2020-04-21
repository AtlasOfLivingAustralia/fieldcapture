<h4>Project assets</h4>
<table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="asset">Species, ecological community or environmental asset(s) the project is targeting</th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.assets">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <td class="outcome">
            <span data-bind="text:description"></span>
        </td>
    </tr>
    </tbody>
</table>