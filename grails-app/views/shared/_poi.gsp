<div id="poi-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${images}" var="image">
            <div class="sp-slide">

                <img class="sp-image" src="${image.url}"/>

                <div class="sp-caption">
                    <h3 class="image-caption"><fc:truncate value="${image.name}" maxLength="45"/></h3>
                    <g:if test="${image.attribution}"><p class="image-attribution">Photo by: ${image.attribution}</p></g:if>
                    <a href="${g.createLink(controller: 'project', action:'index', id:image.projectId)}"><p class="image-project"><fc:truncate value="${image.projectName}" maxLength="80"/></p></a>
                </div>

        </div>
        </g:each>

    </div>


</div>
<r:script>
    $(function() {
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
    });
</r:script>
