<!-- ko:stopBinding true -->
<div id="blog">
    <div class="blog-entry" data-bind="foreach:entries">
        <img class="floatleft" src="">
        <div class="widget-news-right-body">
            <h3 class="title" data-bind="text:title"></h3><span class="floatright" data-bind="text:date"></span>
            <div class="text" data-bind="text:text"></div>
        </div>
    </div>
</div>
<!-- /ko -->
<r:script>
    $(function() {
        //var data = <fc:modelAsJavascript model="${[]}"/>;
        var data = [
            {title:'Test', text:'This is a test', date:'2 Sep'}
        ];
        var blog = new BlogViewModel(data);
        ko.applyBindings(blog, document.getElementById('blog'));
    });
</r:script>
