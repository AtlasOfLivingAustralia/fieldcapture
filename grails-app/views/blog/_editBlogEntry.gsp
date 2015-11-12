<form id="blogEntry" class="form-horizontal validationEngineContainer">

    <div class="control-group required">
        <label class="control-label span3"
               for="type">Type: <fc:iconHelp>What type of entry is this?</fc:iconHelp></label>
        <div class="span9">
            <select id="type" data-bind="options:transients.blogEntryTypes, value:type"></select>
        </div>
    </div>

    <div class="control-group required">
        <label class="control-label span3"
               for="date">Date: <fc:iconHelp>The date for this blog entry</fc:iconHelp></label>
        <div class="span9">
            <div class="input-append">
                <fc:datePicker targetField="date.date" name="date" data-validation-engine="validate[required]"/>
            </div>
        </div>
    </div>

    <div class="control-group required">
        <label class="control-label span3"
               for="title">Title: <fc:iconHelp>The title of this blog entry</fc:iconHelp></label>
        <div class="span9">
            <input type="text" id="title" class="input-xxlarge" data-bind="value:title" data-validation-engine="validate[required]">
        </div>
    </div>

    <div class="control-group">
        <label class="control-label span3"
               for="image">Feature image: <fc:iconHelp>An image that will be displayed alongside this blog entry</fc:iconHelp></label>

        <div class="span3" style="text-align:center;background:white">
            <div style="margin:0;padding:0;width:200px;height:150px;line-height:146px;text-align:left;">
                <img alt="No image provided" data-bind="attr:{src:imageUrl}">
            </div>
        </div>
        <div class="span3">
            <span class="btn fileinput-button"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="mainImage"
                  data-owner-type="blogEntryId"
                  data-owner-id="${blogEntry?.blogEntryId}"
                  data-bind="stagedImageUpload:documents, visible:!image()"><i class="icon-plus"></i> <input
                    id="image" type="file" name="files"><span>Attach</span></span>

            <button class="btn main-image-button" data-bind="click:removeBlogImage, visible:image()"><i
                    class="icon-minus"></i> Remove</button>
        </div>
    </div>
    <div class="control-group" data-bind="with:image">
        <label class="control-label span3"
               for="attribution">Image attribution: <fc:iconHelp>Will be displayed alongside the image</fc:iconHelp></label>
        <div class="span9">
            <input type="text" id="attribution" class="input-xxlarge" data-bind="value:attribution">
        </div>
    </div>
    <div class="control-group" data-bind="with:image">
        <label class="control-label required span3"
               for="declaration">Privacy declaration: <fc:iconHelp>You must accept the declaration before the image can be saved.</fc:iconHelp></label>
        <div class="span9">
            <label id="thirdPartyDeclarationText" class="checkbox" for="declaration">
                <input id="declaration" type="checkbox" name="thirdPartyConsentDeclarationMade" data-validation-engine="validate[required]" data-bind="checked:thirdPartyConsentDeclarationMade">
                <fc:getSettingContent settingType="${au.org.ala.fieldcapture.SettingPageType.THIRD_PARTY_PHOTO_CONSENT_DECLARATION}"/>
            </label>
        </div>
    </div>

    <div class="control-group required">
        <label class="control-label span3" for="blog-content">Content: <fc:iconHelp>The content of this blog entry</fc:iconHelp></label>
        <div class="span9">
            <textarea rows="10" id="blog-content" class="input-xxlarge" data-bind="value:content" data-validation-engine="validate[required]" placeholder="Content goes here..."></textarea>
            <br/><button class="btn popup-edit" data-bind="click:editContent"><i class="icon-edit"></i> Edit with Markdown Editor</button>
        </div>
    </div>

    <div class="control-group">
        <label class="control-label span3"
               for="title">See More URL: <fc:iconHelp>If supplied, the blog entry will show a "see more" link at the end which will take the user to this URL</fc:iconHelp></label>
        <div class="span9">
            <input type="text" id="viewMoreUrl" class="input-xxlarge" data-bind="value:viewMoreUrl" data-validation-engine="validate[custom[url]]">
        </div>
    </div>
</form>
<g:render template="/shared/attachDocument" plugin="fieldcapture-plugin"/>
<g:render template="/shared/markdownEditorModal" plugin="fieldcapture-plugin"/>