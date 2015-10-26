<div id="poi-slider" class="slider-pro">
    <div class="sp-slides">
        <div class="sp-slides">
            <div class="sp-slide">
                <img class="sp-image" src="http://ecodata.ala.org.au/uploads/2015-02/thumb_Site_1_20712_Start.jpg" data-src="http://ecodata.ala.org.au/uploads/2015-02/thumb_Site_1_20712_Start.jpg"/>
                <p class="sp-layer sp-white sp-padding"><h3>My Site</h3><p>My project</p>
            </div>

            <div class="sp-slide">
                <a href="http://bqworks.com">
                    <img class="sp-image" src="http://ecodata.ala.org.au/uploads/2015-02/thumb_BD_site_2_181213.jpg" data-src="http://ecodata.ala.org.au/uploads/2015-02/thumb_BD_site_2_J10b_181213.jpg"/>
                    <p class="sp-layer sp-white sp-padding"><h3>Test</h3><p>Test test test</p>
                </a>
            </div>

            <div class="sp-slide">
                <img class="sp-image" src="http://ecodata.ala.org.au/uploads/2015-02/thumb_BD_site_2_J10b_181213.jpg" data-src="http://ecodata.ala.org.au/uploads/2015-02/thumb_BD_site_2_J10b_181213.jpg"/>
                <p class="sp-layer sp-white sp-padding"><h3>Test</h3><p>Test test test</p>
            </div>
        </div>

    </div>
</div>
<r:script>
    $(function() {
        $( '#poi-slider' ).sliderPro({
            width: '100%',
            height: '300',
            centre:true,
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