<div id="imageViewerModal" class="custom-modal modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div id="modalBody" class="modal-body"></div>

    <div class="modal-footer"><span class="caption left"></span><button class="btn" data-dismiss="modal">Close</button></div>
</div>

<r:script>

    $(function () {
        window['showImageInViewer'] = function (imageId, imageUrl, caption) {
            var imageViewerModal = $('#imageViewerModal');
            var imageViewerContainerSelector = '#modalBody';

            $('#imageViewerModal .caption').text(caption);
            imageViewerModal.modal({show: false});
            $(imageViewerContainerSelector).empty();

            if (imageId) {

                imgvwr.viewImage(imageViewerContainerSelector, imageId, {imageServiceBaseUrl: '${grailsApplication.config.ala.image.service.url}', initialZoom:-1});
                // Because we use relative sizing on the viewer container, when leaflet is initialised it has 0 size
                // This timer will invalidate that after the modal css transition is finished and the viewer has a non-zero height.
                imageViewerModal.on('shown', function() {
                    setTimeout( function() {
                        imgvwr.resizeViewer(imageViewerContainerSelector);
                    }, 100);
                });
            }
            else {
                $(imageViewerContainerSelector).append($('<img src="'+imageUrl+'"/>'));
            }

            imageViewerModal.modal('show');

        }
    });
</r:script>