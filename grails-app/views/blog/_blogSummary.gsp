<!-- ko stopBinding:true -->
<div id="site-blog">
    <g:if test="${blog.size() > 0}">
        <ul class="unstyled" data-bind="foreach:entries">
            <li>
                <img data-bind="attr:{src:imageUrl}" class="pull-left" width="50" height="50">
                <div>
                    <div class="row-fluid">
                        <strong data-bind="text:title"></strong>
                        <div class="pull-right">
                            <a href data-bind="click:$parent.editBlogEntry">Edit</a> |
                            <a href data-bind="click:$parent.deleteBlogEntry">Delete</a>
                        </div>
                    </div>
                    <p data-bind="text:shortContent"></p>
                </div>
                <hr/>
            </li>

        </ul>
    </g:if>
    <g:else>
        No blog entries.
    </g:else>

    <div class="form-actions">
        <button data-bind="click:newBlogEntry" type="button" id="new" class="btn btn-primary">New Entry</button>
    </div>
</div>
<!-- /ko -->

<r:script>

$(function(){
    var BlogSummary = function(blogEntries) {
        var self = this;
        self.entries = ko.observableArray();

        self.load = function(entries) {
            self.entries($.map(entries, function(blogEntry) {
                return new BlogEntryViewModel(blogEntry);
            }));
        };

        self.newBlogEntry = function() {
            document.location.href = fcConfig.createBlogEntryUrl;
        };
        self.deleteBlogEntry = function(entry) {
            var url = fcConfig.deleteBlogEntryUrl+'&id='+entry.blogEntryId();
            $.post(url).done(function() {
                document.location.reload();
            });
        };
        self.editBlogEntry = function(entry) {
            document.location.href = fcConfig.editBlogEntryUrl+'&id='+entry.blogEntryId();
        };
        self.load(blogEntries);
    };
    var blog = ${fc.modelAsJavascript(model:blog, default:'[]')};
    ko.applyBindings(new BlogSummary(blog), document.getElementById('site-blog'));
});

</r:script>