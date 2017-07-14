

<div id="image-gallery">

    <!-- ko foreach: images -->

        <div class="imgCon">
            <a class="cbLink" rel="thumbs" id="thumb" data-bind="attr:{href:ref}">
                <img src="" data-bind="attr:{src:thumbnailUrl, title:name}" class="image thumbnail"/>
                <i class="approval-status fa fa-3x pull-right" data-bind="css:{'fa-thumbs-up':approved, 'fa-thumbs-down':rejected}"></i>
                <div class="meta brief"><span data-bind="text:name"></span> </div>
                <div class="meta detail hide">
                    <button data-bind="click:$parent.approve"><i class="fa fa-thumbs-o-up fa-4x"></i></button>
                    <button data-bind="click:$parent.reject" class="pull-right"><i class="fa fa-thumbs-o-down fa-4x"></i></button>
                </div>
            </a>
        </div>

    <!-- /ko -->
    <g:render template="/shared/pagination"/>
</div>

<asset:script>
    $(function() {

        var imageGallery = new ImageGallery();

        ko.applyBindings(imageGallery);

        $('#image-gallery').on('mouseenter mouseleave', '.imgCon', function() {
            $(this).find('.brief, .detail').toggleClass('hide');
        });

    });
</asset:script>
