<div id="poi-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${images}" var="image">
            <div class="sp-slide">

                <img class="sp-image" data-src="${image.url}" title="${image.name?:"Un-captioned image for project ${image.projectName}"}"/>

                <div class="sp-caption">
                    <g:if test="${image.name}"><h3 class="image-caption"><fc:truncate value="${image.name}" maxLength="45"/></h3></g:if>
                    <a href="${g.createLink(controller: 'project', action:'index', id:image.projectId)}">
                        <p class="image-project"><fc:truncate value="${image.projectName}" maxLength="80"/></p>
                    </a>
                    <p class="image-attribution">
                        <g:if test="${image.attribution}">Photo by: ${image.attribution}</g:if>
                    </p>
                </div>

        </div>
        </g:each>

    </div>


</div>
<asset:script>
    $(function() {
        if ($('#poi-slider .sp-image').length > 0) {
            $( '#poi-slider' ).sliderPro({
                arrows: false,
                buttons: false,
                fade: true,
                //autoHeight:true,
                autoplay: true,
                imageScaleMode:'cover',
                touchSwipe:true,
                buttons:true
            });
        }
    });
</asset:script>
