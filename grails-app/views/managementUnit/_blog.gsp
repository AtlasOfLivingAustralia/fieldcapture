<g:if test="${editable || hasNewsAndEvents || hasProgramStories || hasPhotos}">
    <div class="row-fluid">
        <g:if test="${editable}">
            <p>
                <a class="newBlog" href="${g.createLink(controller: 'blog', action: 'create', params:[managementUnitId: mu.managementUnitId, returnTo:g.createLink(controller: 'managementUnit', action:'index', id:mu.managementUnitId)])}"><button class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
            <button id="gotoEditBlog" class="btn"><i class="fa fa-edit"></i> Edit</button>
            </a>
        </p>
        </g:if>


        <g:if test="${hasNewsAndEvents}">
            <div class="row-fluid">
                <div class="well-title">News and Events</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blogs, type:'News and Events']}"/>
                </div>
            </div>
        </g:if>

        <g:if test="${hasManagementUnitStories}">
            <div class="row-fluid">
                <div class="well-title">Program stories</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blogs, type:'Management Unit Stories']}"/>
                </div>
            </div>
        </g:if>

        <g:if test="${hasPhotos}">
            <div class="row-fluid">
                <div class="well-title">Photos</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blogs, type:'Photo']}"/>
                </div>
            </div>
        </g:if>

    </div>
</g:if>
