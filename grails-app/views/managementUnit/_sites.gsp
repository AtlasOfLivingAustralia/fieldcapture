<g:if test="${showShapefileDownload}">
    <div class="row">
        <div class="col-sm-12">
            <a style="margin-bottom:10px; float:right;" target="_blank" href="${g.createLink(controller: 'program', action: 'downloadShapefile', id:organisation.organisationId)}">
                <button class="btn btn-sm btn-info" type="button">Download Shapefile</button>
            </a>
        </div>
    </div>
</g:if>
<g:render template="/shared/sites"/>

