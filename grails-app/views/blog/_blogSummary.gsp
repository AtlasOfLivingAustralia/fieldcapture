<!-- ko stopBinding:true -->
<div id="site-blog">
    <g:if test="${blog.size() > 0}">
        <ul class="unstyled list-unstyled" data-bind="foreach:entries">
            <li class="customBorder mb-2">
                <img data-bind="visible:imageUrl(), attr:{src:imageThumbnailUrl}" class="pull-left mr-2 customImage" width="50" height="50">
                <i class="blog-icon floatleft fa fa-3x" data-bind="visible:stockIcon(), css:stockIcon"></i>
                <div>
                    <div class="row">
                        <strong class="col-sm-8" data-bind="text:title"></strong>
                        <div class="col-sm-4 text-right pull-right">
                            <a class="editThisBlog" href data-bind="click:$parent.editBlogEntry">Edit</a> |
                            <a class="delThisBlog" href data-bind="click:$parent.deleteBlogEntry">Delete</a>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-10 customCol">
                            <p data-bind="text:shortContent"></p>
                        </div>
                    </div>

                </div>
            </li>

        </ul>
    </g:if>
    <g:else>
        No blog entries.
    </g:else>

    <div class="form-actions">
        <button data-bind="click:newBlogEntry" type="button" id="new" class="btn btn-sm btn-primary">New Entry</button>
    </div>
</div>
<!-- /ko -->

<asset:script>

$(function(){

    var blog = ${fc.modelAsJavascript(model:blog, default:'[]')};
    ko.applyBindings(new BlogSummary(blog), document.getElementById('site-blog'));
});

</asset:script>
