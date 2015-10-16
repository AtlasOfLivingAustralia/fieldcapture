<!-- ko:stopBinding true -->
<div id="blog">
    <div class="blog-entry" data-bind="foreach:entries">
        <img class="floatleft" src="">
        <span class="title" data-bind="text:title"></span><span class="floatright" data-bind="text:date"></span>
        <div class="text" data-bind="text:text"></div>
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
