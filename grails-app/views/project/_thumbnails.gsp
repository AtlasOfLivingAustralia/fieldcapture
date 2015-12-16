
<div id="public-images-slider">

    <ul class="project-thumbnails">
        <g:each in="${publicImages}" var="image">
            <li class="thumbnail-container">
                <div class="thumbnail-image-container">
                    <a class="fancybox" rel="group" href="${image.url}" aria-label="Show full size images in popup window"><img src="${image.url}" aria-label="${image.name?:"Un-captioned project image"}"/></a>
                </div>
                <p class="caption"><fc:truncate value="${image.name}" maxLength="40"/></p>
            </li>

        </g:each>

    </ul>
</div>
