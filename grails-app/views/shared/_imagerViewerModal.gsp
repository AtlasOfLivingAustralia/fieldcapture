

<r:script>

    $(function () {

        var showViewer = function(imageId) {
            var selector = '.fancybox-inner';
            $(selector).css('overflow', 'hidden');
            imgvwr.viewImage(selector, imageId, {imageServiceBaseUrl: '${grailsApplication.config.ala.image.service.url}', initialZoom:-1});
        }


        var initViewer = function(element) {
            var knockoutModel = ko.dataFor(element);
            if (knockoutModel && knockoutModel.id) {
                showViewer(knockoutModel.id);
            }

        }

        var beforeHandler = function () {

            console.log(this);
            var knockoutModel = ko.dataFor(this.element.get(0));
            if (knockoutModel && knockoutModel.id) {
                this.height = $(window).height() * 0.8;
                this.width = $(window).width() * 0.8;
                this.type = 'html';
                this.content = '<div></div>';
                this.autoWidth = false;
                this.autoHeight = false;
                this.href = null;
            }
            else {
                this.autoSize = true;
                this.type = 'image';

            }


        }

        $('.imageList a').attr('rel', 'gallery').fancybox({type:'html', nextEffect:'fade', preload:0, 'prevEffect':'fade', beforeLoad:beforeHandler, afterShow:function(){ initViewer($.fancybox.current.element.get(0));}});
    });
</r:script>