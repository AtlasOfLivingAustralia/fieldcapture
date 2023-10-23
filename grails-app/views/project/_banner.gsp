<g:set var="bannerConfig" value="${config?.program?.config?.banner}"/>
<g:if test="${bannerConfig?.message}">
    <g:if test="${bannerConfig.public || user?.isEditor}">
    <div class="row">
        <div class="col-12">
            <div class="alert alert-banner">
                <span style="font-size:${bannerConfig.fontSize?:'1.4em'}">
                <fc:markdownToHtml>${bannerConfig.message}</fc:markdownToHtml>
                </span>
            </div>
        </div>
    </div>
    </g:if>
</g:if>