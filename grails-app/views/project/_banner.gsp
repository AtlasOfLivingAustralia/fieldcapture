<g:set var="bannerConfig" value="${config?.program?.config?.banner}"/>
<g:if test="${bannerConfig?.message}">
    <g:if test="${bannerConfig.public || user?.isEditor}">
    <div class="row">
        <div class="col-12">
            <div class="alert alert-warning">
                <markdown:renderHtml>${bannerConfig.message}</markdown:renderHtml>
            </div>
        </div>
    </div>
    </g:if>
</g:if>