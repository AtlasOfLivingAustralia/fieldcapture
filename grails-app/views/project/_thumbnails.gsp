
<div id="public-images-slider">

    <ul class="project-thumbnails">
        <g:each in="${publicImages}" var="image">
            <li class="thumbnail-container">
                <div class="thumbnail-image-container">
                    <a class="fancybox" rel="group" href="${image.url}"><img src="${image.url}"/></a>
                </div>

                <p class="caption"><fc:truncate value="${image.name}" maxLength="40"/></p>

            </li>

        </g:each>

    </ul>

</div>
<r:script>
    $(function() {

    });
</r:script>