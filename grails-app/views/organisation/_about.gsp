<div id="carousel" class="slider-pro row" data-bind="visible:mainImageUrl()" style="margin-bottom:20px;">
    <div class="sp-slides">
        <div class="sp-slide">
            <img class="sp-image" data-bind="attr:{'data-src':mainImageUrl}"/>
            <p class="sp-layer sp-white sp-padding"
               data-position="topLeft" data-width="100%" data-bind="visible:url"
               data-show-transition="down" data-show-delay="0" data-hide-transition="up">
                <strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong>
            </p>
        </div>
    </div>
</div>

<div id="weburl" data-bind="visible:!mainImageUrl()">
    <div data-bind="visible:url()"><strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong></div>
</div>

<div data-bind="visible:description">
    <div class="col-sm-12 card customCard">
        <div class="card-title">About ${organisation.name?.encodeAsHTML()}</div>

        <span id="orgDescription" data-bind="html:description.markdownToHtml()"></span>

        <p>ABN: <span id="orgAbn">${organisation.abn}</span></p>
    </div>
</div>
