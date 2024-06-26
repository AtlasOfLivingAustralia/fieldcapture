<form id="blogEntry" class="validationEngineContainer">

    <h4><label class="col-form-label row-cols-sm-1" style="font-size: small"><g:message code="attach.document.subtitle"/><a href="https://www.dcceew.gov.au/environment/environmental-information-data/information-policy/sensitive-ecological-data-access-and-management-policy" target="_blank"> <g:message code="attach.document.subtitle.link"/></a>
        <fc:iconHelp helpTextCode="attach.document.help"></fc:iconHelp></label></h4>
    <div class="form-group row required">
        <label class="control-label col-sm-3"
               for="type">Type: <fc:iconHelp>What type of entry is this?</fc:iconHelp></label>
        <div class="col-sm-9">
            <select id="type" class="form-control form-control-sm input-small" data-bind="options:transients.blogEntryTypes, value:type"></select>
        </div>
    </div>

    <div class="form-group row required">
        <label class="control-label col-sm-3"
               for="date">Date: <fc:iconHelp>The date for this blog entry</fc:iconHelp></label>
        <div class="col-sm-9">
            <div class="input-group input-append input-small">
                <fc:datePicker targetField="date.date" bs4="true" class="form-control form-control-sm" name="date" data-validation-engine="validate[required]" autocomplete="off"/>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <label class="control-label col-sm-3"
               for="keepOnTop">Keep on top: <fc:iconHelp>Normally, blog entries are sorted by date.  Checking this box will keep this entry above others that do not have this box checked.</fc:iconHelp></label>
        <div class="col-sm-9">
            <div class="input-append">
                <input type="checkbox" id="keepOnTop" data-bind="checked:keepOnTop"/>
            </div>
        </div>
    </div>

    <div class="form-group row required">
        <label class="control-label col-sm-3"
               for="title">Title: <fc:iconHelp>The title of this blog entry</fc:iconHelp></label>
        <div class="col-sm-9">
            <input type="text" id="title" class="form-control form-control-sm input-medium" data-bind="value:title" data-validation-engine="validate[required]">
        </div>
    </div>


    <div class="form-group row">
        <!-- ko if:type() !== 'Photo' -->
        <label class="control-label col-sm-3"
               for="image">Feature image: <fc:iconHelp>An image that will be displayed alongside this blog entry</fc:iconHelp>
        </label>
        <!-- /ko -->
        <!-- ko if:type() == 'Photo' -->
        <label class="control-label col-sm-3"
               for="image">Project photo: <fc:iconHelp>The photo that will be attached to the project images section of the blog</fc:iconHelp>
        </label>
        <!-- /ko -->

        <div class="col-sm-3" style="text-align:center;background:white" data-bind="visible:!stockIcon()">
            <div style="margin:0;padding:0;width:200px;height:150px;line-height:146px;text-align:left;">
                <img alt="No image provided" style="width: 200px" data-bind="attr:{src:imageUrl}"/>
            </div>
        </div>
        <div class="col-sm-3" data-bind="visible:stockIcon()">
            <i class="fa fa-4x" data-bind="css:stockIcon"></i>
        </div>
        <div class="ml-3 col-sm-3">
            <!-- ko if:type() !== 'Photo' -->
            <p data-bind="visible:!image() && !stockIcon()">Select or attach an image</p>

            <select class="form-control form-control-sm" data-bind="visible:!image(), value:stockIcon" name="docCategory">
                <option/>
                <option value="fa-warning">Important<i class="fa fa-warning fa-3x"></i></option>
                <option value="fa-newspaper-o">News<i class="fa fa-newspaper-o fa-3x"></i></option>
                <option value="fa-star">Star<i class="fa fa-star-o fa-3x"></i></option>
                <option value="fa-info-circle">Information<i class="fa fa-info-circle fa-3x"></i></option>
            </select>
            <p></p>
            <!-- /ko -->

            <div class="btn btn-sm fileinput-button"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="mainImage"
                  data-owner-type="blogEntryId"
                  data-owner-id="${blogEntry?.blogEntryId}"
                  data-bind="stagedImageUpload:documents, visible:!image() && !stockIcon()"><i class="fa fa-plus "></i> <input
                    id="image" type="file" name="files" class="form-control form-control-sm input-small"><span>Attach</span></div>

            <button class="btn btn-sm float-right main-image-button" data-bind="click:removeBlogImage, visible:image()"><i
                    class="fa fa-minus"></i> Remove</button>
        </div>

        </div>

    <div class="form-group row" data-bind="with:image">
        <label class="control-label col-sm-3"
               for="attribution">Image attribution: <fc:iconHelp>Will be displayed alongside the image</fc:iconHelp></label>
        <div class="col-sm-9">
            <input type="text" id="attribution" class="form-control form-control-sm input-medium" data-bind="value:attribution">
        </div>
    </div>
    <div class="form-group row" data-bind="with:image">
        <label class="control-label required col-sm-3"
               for="declaration">Privacy declaration: <fc:iconHelp>You must accept the declaration before the image can be saved.</fc:iconHelp></label>
        <div class="col-sm-6">
            <label id="thirdPartyDeclarationText" class="checkbox" for="declaration">
                <input id="declaration" type="checkbox" name="thirdPartyConsentDeclarationMade" data-validation-engine="validate[required]" data-bind="checked:thirdPartyConsentDeclarationMade">
                <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.THIRD_PARTY_PHOTO_CONSENT_DECLARATION}"/>
            </label>
        </div>
    </div>

    <!-- ko if:type() !== 'Photo' -->
    <div class="form-group row required">
        <label class="control-label col-sm-3" for="blog-content">Content: <fc:iconHelp>The content of this blog entry</fc:iconHelp></label>
        <div class="col-sm-9">
            <textarea rows="10" id="blog-content" class="form-control form-control-sm input-medium" data-bind="value:content" data-validation-engine="validate[required]" placeholder="Content goes here..."></textarea>
            <br/><button class="btn btn-sm popup-edit" data-bind="click:editContent"><i class="fa fa-edit"></i> Edit with Markdown Editor</button>
        </div>
    </div>

    <div class="form-group row">
        <label class="control-label col-sm-3"
               for="title">See More URL: <fc:iconHelp>If supplied, the blog entry will show a "see more" link at the end which will take the user to this URL</fc:iconHelp></label>
        <div class="col-sm-9">
            <input class="form-control form-control-sm input-medium" type="text" id="viewMoreUrl" data-bind="value:viewMoreUrl" data-validation-engine="validate[custom[url]]">
        </div>
    </div>
    <!-- /ko -->
</form>
<g:render template="/shared/attachDocument"/>
<g:render template="/shared/markdownEditorModal"/>
