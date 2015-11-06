<div id="poi-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${images}" var="image">
            <div class="sp-slide">

                <img class="sp-image" src="${image.url}"/>

                <h3 class="sp-layer sp-black" data-width="100%" data-height="30px" data-stay-duration="-1" style="padding-left:5px;"><fc:truncate value="${image.name}" maxLength="40"/></h3>
                <p class="sp-layer sp-black" data-width="100%" data-height="20px" data-vertical="30px" style="padding-left:5px;"><fc:truncate value="${image.projectName}" maxLength="60"/></p>


        </div>

        </g:each>

    </div>


</div>
<r:script>
    $(function() {
        $( '#poi-slider' ).sliderPro({
            width: '100%',
            height: '400',
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
