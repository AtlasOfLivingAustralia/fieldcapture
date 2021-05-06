<g:applyLayout name="nrm_bs4">
    <head>
        <title><g:layoutTitle /></title>
        <g:layoutHead/>
        <style type="text/css">

        .icon-chevron-right {
            float: right;
            margin-top: 2px;
            margin-right: -6px;
            opacity: .25;
        }

        /* Pagination fix */
        .pagination .disabled, .pagination .currentStep, .pagination .step {
            float: left;
            padding: 0 14px;
            border-right: 1px solid;
            line-height: 34px;
            border-right-color: rgba(0, 0, 0, 0.15);
        }
        .pagination .prevLink {
            border-right: 1px solid #DDD !important;
            line-height: 34px;
            vertical-align: middle;
            padding: 0 14px;
            float: left;
        }

        .pagination .nextLink {
            vertical-align: middle;
            line-height: 34px;
            padding: 0 14px;
        }
        #dashboardType {
            width: 18rem;
        }
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
                <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'audit')}" title="Audit" />
                <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.adminRole) || fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole)}">
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'staticPages')}" title="Static pages" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'editHelpLinks')}" title="Help Resources"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'editSiteBlog')}" title="Site Blog"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'selectHomePageImages')}" title="Home Page Images"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'adminReports')}" title="Administrator Reports"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'gmsProjectImport')}" title="Load new projects into MERIT"/>
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'removeUserPermission')}" title="Remove User from MERIT"/>
                </g:if>
                <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole)}">
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'tools')}" title="Tools" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'settings')}" title="Settings" />
                    <fc:breadcrumbItem href="${createLink(controller: 'admin', action: 'cacheManagement')}" title="Caches" />
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
