
<div id="public-images-slider" class="slider-pro">

    <div class="sp-slides">
        <g:each in="${publicImages}" var="image">
            <div class="sp-slide">

                <img class="sp-image" src="${image.url}"/>

                <h3 class="sp-layer sp-black" data-width="100%" data-height="30px" data-stay-duration="-1" style="padding-left:5px;"><fc:truncate value="${image.name}" maxLength="40"/></h3>

                <div class="sp-thumbnail">
                    <img class="sp-thumbnail-image" src="${image.url}"/>

                    <p class="sp-thumbnail-text"><fc:truncate value="${image.name}" maxLength="40"/></p>
                </div>
            </div>

        </g:each>

    </div>

</div>
<r:script>
    $(function() {

    });
</r:script>