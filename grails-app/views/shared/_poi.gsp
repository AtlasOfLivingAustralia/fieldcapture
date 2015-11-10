<div id="poi-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${images}" var="image">
            <div class="sp-slide">

                <img class="sp-image" src="${image.url}"/>

                <div class="sp-caption">
                    <h3><fc:truncate value="${image.name}" maxLength="60"/></h3>
                    <a href="${g.createLink(controller: 'project', action:'index', id:image.projectId)}"><p><fc:truncate value="${image.projectName}" maxLength="80"/></p></a>
                </div>

        </div>
        </g:each>

    </div>


</div>
<r:script>
    $(function() {
        $( '#poi-slider' ).sliderPro({
            width:'400',
            centerImage:true,
            imageScaleMode:'contain',
            arrows: false,
            buttons: false,
            waitForLayers: true,
            fade: true,
            autoplay: true,
            autoScaleLayers: false,
            touchSwipe:true,
            buttons:true
        });
    });
</r:script>
