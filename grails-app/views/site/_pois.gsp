<h2>Points of interest at this site</h2>
<g:each in="${site.poi}" var="poi">
    <div class="row ps-3 pe-3">
        <h4 class="col-sm-12">${poi.name?.encodeAsHTML()}</h4>
    <g:if test="${poi.description}">${poi.description}</g:if>
    <g:if test="${poi.photos}"><g:render template="sitePhotos" model="${[photos:poi.photos]}"></g:render></g:if> </h4>

        </div>
</g:each>
