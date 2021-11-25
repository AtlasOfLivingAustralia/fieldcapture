
<div class="row">
<div class="col-sm-offset-10" id="hub-member-list">
        <table class="table-width" id="member-list">
            <thead>
                <th>User Id</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Expiry Date</th>
                <th></th>
            </thead>
        </table>
    </div>

</div>
<asset:script type="text/javascript">
    initialise(${raw((roles as grails.converters.JSON).toString())}, ${user?.userId}, "${hubId}");
</asset:script>
<asset:javascript src="permissionTable.js"/>