<div id="poi-slider" class="slider-pro">
    <div class="sp-slides">
        <div class="sp-slides">
            <g:each in="${images}" var="image">
                <div class="sp-slide">
                    <a href="${g.createLink(controller: 'project', action:'index', id:image.projectId)}">
                    <img class="sp-image" src="${image.url}"/>
                    </a>
                    <p class="sp-layer sp-white sp-padding"><h3>${image.name}</h3><p>${image.projectName}</p>

                </div>

            </g:each>

        </div>

    </div>
</div>
<r:script>
    $(function() {
        $( '#poi-slider' ).sliderPro({
            width: '100%',
            height: '400',
            centerImage:true,
            imageScaleMode:'contain',
            arrows: false, // at the moment we only support 1 image
            buttons: false,
            waitForLayers: true,
            fade: true,
            autoplay: true,
            autoScaleLayers: false,
            touchSwipe:true
        });
    });
</r:script>