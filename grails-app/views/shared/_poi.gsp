<div id="poi-carousel" class="carousel slide" data-bs-theme="dark"  data-bs-pause="false" data-bs-ride="carousel">
    <ol class="list-unstyled carousel-indicators">
        <g:each in="${images}" var="image" status="i">
            <button type="button" data-bs-target="#poi-carousel" data-bs-slide-to="${i}" <g:if test="${i==0}">class="active" aria-current="true"</g:if> aria-label="Image ${i}"></button>
        </g:each>
    </ol>
    <div class="carousel-buttons">
        <button type="button" class="pause" aria-label="Pause carousel"><i class="fa fa-pause"></i></button>
        <button type="button" class="play" disabled="disabled" aria-label="Play carousel"><i class="fa fa-play"></i></button>
    </div>
    <div class="carousel-inner">
        <g:each in="${images}" var="image" status="i">
            <div class="carousel-item <g:if test="${i==0}">active</g:if>">
                <img class="img-fluid" src="${image.url}" alt="${image.name?:"Un-captioned image for project ${image.projectName}"}" title="${image.name?:"Un-captioned image for project ${image.projectName}"}"/>
                <div class="caption">
                    <g:if test="${image.name}"><h3 class="image-caption"><fc:truncate value="${image.name}" maxLength="45"/></h3></g:if>
                    <a href="${g.createLink(controller: 'project', action:'index', id:image.projectId)}">
                        <p class="image-project"><fc:truncate value="${image.projectName}" maxLength="80"/></p>
                    </a>
                    <g:if test="${image.attribution}">
                    <p class="image-attribution">
                        Photo by: ${image.attribution}
                    </p>
                    </g:if>
                </div>

        </div>
        </g:each>

    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#poi-carousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#poi-carousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
<asset:script>
    $(function() {
        if ($('#poi-carousel .carousel-item').length > 0) {
            $( '#poi-carousel').carousel();
            let $play = $( '#poi-carousel button.play' );
            let $pause = $( '#poi-carousel button.pause' );
            $play.on('click', function() {
                $( '#poi-carousel').carousel('cycle');
                $play.attr('disabled', 'disabled');
                $pause.removeAttr('disabled');
            });
            $pause.on('click', function() {
                $( '#poi-carousel').carousel('pause');
                $pause.attr('disabled', 'disabled');
                $play.removeAttr('disabled');
            });
            $( '#poi-carousel').carousel().on('slide.bs.carousel', function() {
                 $pause.removeAttr('disabled');
                 $play.attr('disabled', 'disabled');
            });
        }

    });
</asset:script>
