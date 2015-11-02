
<div id="public-images-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${publicImages}" var="image">
            <div class="sp-slide">

                <img class="sp-image" src="${image.url}"/>

                <h3 class="sp-layer sp-black" data-width="100%" data-height="30px" data-stay-duration="-1" style="padding-left:5px;">${image.name}</h3>
                <p class="sp-layer sp-black" data-width="100%" data-height="20px" data-vertical="30px" style="padding-left:5px;">${image.projectName}</p>

                <div class="sp-thumbnail">
                    <img class="sp-thumbnail-image" src="${image.url}"/>

                    <p class="sp-thumbnail-text">${image.name}</p>
                </div>
            </div>

        </g:each>

    </div>

</div>
<r:script>
    $(function() {

    });
</r:script>