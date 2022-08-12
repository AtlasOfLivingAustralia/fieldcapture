<g:applyLayout name="nrm_bs4">
    <head>
        <title><g:layoutTitle /></title>
        <g:layoutHead/>
        <style>

        @media (min-width: 1200px){
            .row {
                margin-left: 0px !important;
                zoom: 1;
            }
        }

        </style>
        <asset:stylesheet src="admin.css"/>
    </head>

    <body>
    <div class="${containerType}">
        <div aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><g:link controller="home">Home </g:link></li>
                <li class="breadcrumb-item"><g:link class="discreet" action="index">Administration</g:link></li>
                <li class="breadcrumb-item"><g:pageProperty name="page.pageTitle"/></li>
            </ol>
        </div>

        <div class="row">
            <div id="admin" class="nav flex-column nav-pills col-sm-3 pl-2 pr-0">
                <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'audit')}"  class="audit" title="Audit" />
                <g:if test="${fc.userIsAlaOrFcAdmin()}">
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'staticPages')}" class="staticPages" title="Static pages" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'editHelpLinks')}" class="helpResource" title="Help Resources"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'editSiteBlog')}" class="siteBlog" title="Site Blog"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'selectHomePageImages')}" class="homePageImage" title="Home Page Images"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'adminReports')}" class="adminReport" title="Administrator Reports"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'gmsProjectImport')}" class="loadProject" title="Load new projects into MERIT"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'removeUserPermission')}" class="removeUser" title="Remove User from MERIT"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'createUserHubPermission')}" class="userPermission" title="User Permissions for MERIT"/>
                </g:if>
                <g:if test="${fc.userIsAlaAdmin()}">
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'tools')}" class="tools" title="Tools" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'settings')}" class="settings" title="Settings" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'cacheManagement')}" class="caches" title="Caches" />
                </g:if>
            </div>
            <div class="col-sm-8 ml-5">
                <g:if test="${flash.errorMessage}">
                    <div class="${containerType}">
                        <div class="alert alert-danger">
                            ${flash.errorMessage}
                        </div>
                    </div>
                </g:if>

                <g:if test="${flash.message}">
                    <div class="${containerType}">
                        <div class="alert alert-info">
                            ${flash.message}
                        </div>
                    </div>
                </g:if>

                <g:layoutBody/>

            </div>
        </div>  <!-- end of row -->
    </div>
    </body>
</g:applyLayout>

