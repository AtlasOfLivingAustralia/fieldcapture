<div id="poi" class="row-fluid slider-pro">
    <div class="sp-slides">
        <div class="sp-slides">
            <div class="sp-slide">
                <img class="sp-image" src="path/to/blank.gif" data-src="path/to/image1.jpg"/>
                <p class="sp-layer sp-white sp-padding"><strong>My Site</strong><br>My project</p>
            </div>

            <div class="sp-slide">
                <a href="http://bqworks.com">
                    <img class="sp-image" src="path/to/blank.gif" data-src="path/to/image2.jpg"/>
                    <p class="sp-layer sp-white sp-padding"><strong>Test</strong><br>Test test test</p>
                </a>
            </div>

            <div class="sp-slide">
                <img class="sp-image" src="path/to/blank.gif" data-src="path/to/image3.jpg"/>
                <p class="sp-layer sp-white sp-padding"><strong>Test</strong><br>Test test test</p>
            </div>
        </div>

    </div>
</div>
<r:script>
    $(function() {
        $( '#poi' ).sliderPro({
            width: '100%',
            height: '300',
            centre:true,
            arrows: false, // at the moment we only support 1 image
            buttons: false,
            waitForLayers: true,
            fade: true,
            autoplay: false,
            autoScaleLayers: false,
            touchSwipe:true
        });
    });
</r:script>