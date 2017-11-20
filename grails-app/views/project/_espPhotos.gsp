<g:if test="${photos}">
    <h2>My species sightings</h2>
    <g:render template="thumbnails" model="${[publicImages:photos]}"/>
</g:if>
<g:if test="${photoPointCount}">
<g:render template="sitePhotoPoints"></g:render>
</g:if>

<g:if test="${!photos && !photoPointCount}">
    No photos have been recorded for this project yet.
</g:if>