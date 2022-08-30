<%@ page import="au.org.ala.merit.DateUtils" %>
<div class="row well well-small">
    <g:if test="${true}">
        <div class="col-sm-12">
            <table class="table table-striped table-bordered table-hover w-100" id="audit-message-list">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>User</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </g:if>
    <g:else>
            <div class="col-sm-12">
                <div class="p-3 alert-danger text-dark">No messages found!</div>
            </div>

    </g:else>
</div>
