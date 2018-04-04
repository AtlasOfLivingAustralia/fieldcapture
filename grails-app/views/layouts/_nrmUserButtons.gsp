<g:if test="${fc.currentUserDisplayName()}">

        <div class="btn-group">
            <button class="btn btn-small btn-sm btn-fc btnProfile" title="My Projects">
                <i class="icon-user icon-white"></i><span class="">My projects</span>
            </button>
        </div>

        <div class="btn-group ">
            <button class="btn btn-small btn-sm btn-fc dropdown-toggle" data-toggle="dropdown">
                <!--<i class="icon-star icon-white"></i>--> My organisations&nbsp;&nbsp;<span class="caret"></span>
            </button>
            <fc:userOrganisationList />
        </div>

    <g:if test="${fc.userIsSiteAdmin()}">
        <div class="btn-group">
            <button class="btn btn-warning btn-small btn-sm btnAdministration"><i class="icon-cog icon-white"></i><span class="">&nbsp;Administration</span></button>
        </div>
    </g:if>
</g:if>