<div class="row">
    <div class="col-sm-7" id="project-member-list">
        <table style="" class="" id="member-list">
            <thead>

                <th>User Id</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Expiry Date</th>
                <th width="5%"></th>
            </thead>
        </table>
    </div>

</div>
<asset:script type="text/javascript">
%{--initialise(${roles.inspect()}, ${user?.userId}, "${hubId}");--}%
%{--for some reason ${roles.inspect() isn't adding single quotes for each list value,
hence passing the list values this way, will cause error otherwise --}%
    initialise(["siteAdmin","officer","siteReadOnly"], ${user?.userId}, "${hubId}");


</asset:script>
<asset:javascript src="permissionTable.js"/>