<form class="validationEngineContainer">
    <h4 class="block-header"><g:message code="organisation.details.header"/></h4>
    <section class="form-group row required">
        <div class="col-sm-2"></div>
        <label for="name" class="col-sm-1 form-check-label">Name: <fc:iconHelp><g:message code="organisation.name.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <g:if test="${organisation.organisationId}">
                    <input type="text" id="name" class="form-control form-control-sm w-100" data-bind="value:name" data-validation-engine="validate[required]" placeholder="Organisation name" ${!isNameEditable?'readonly="readonly"':''}>
            </g:if>
            <g:else>
                <input type="text" id="name" class="form-control form-control-sm w-100" data-bind="value:name, disable: !(name())" data-validation-engine="validate[required]" placeholder="Organisation name" ${!isNameEditable?'readonly="readonly"':''}>
            </g:else>
        </div>
    </section>
    <section class="form-group row">
        <div class="col-sm-2"></div>
        <label for="abnSelector" class="col-sm-1 form-check-label">ABN: <fc:iconHelp><g:message code="organisation.abn.help"/></fc:iconHelp></label>
        <g:if test="${organisation.organisationId}">
            <div class="col-sm-3">
                <input type="text" id="abnSelector" class="w-100 form-control form-control-sm" data-bind="value:abn" data-validation-engine="validate[custom[number],minSize[11],maxSize[11]" data-validation-error-message="Please enter an 11 digit ABN"  maxlength="11" placeholder="Enter ABN Number"/>
            </div>
            <div class="col-sm-2 prePopBtn">
                <button type="button" id="prepopulateFromABN" data-bind="click:prepopulateFromABN" class="btn btn-sm btn-primary" disabled="disabled">Pre Populate From ABN</button>
            </div>
        </g:if>
        <g:else>
            <div class="col-sm-3">
                <input type="text" id="abnSelector" class="w-100 form-control form-control-sm" data-bind="value:abn, valueUpdate: 'input'" data-validation-engine="validate[custom[number],minSize[11],maxSize[11]" data-validation-error-message="Please enter an 11 digit ABN"  maxlength="11" placeholder="Enter ABN Number"/>
            </div>
            <div class="col-sm-2 prePopBtn">
                <button type="button" id="prepopulateFromABN" data-bind="click:prepopulateFromABN, disable: !(abn())" class="btn btn-sm btn-primary" disabled="disabled">Pre Populate From ABN</button>
            </div>
        </g:else>
    </section>
    <section class="form-group row">
        <div class="col-sm-2"></div>
        <label for="acronym" class="col-sm-1 form-check-label">Acronym: <fc:iconHelp><g:message code="organisation.acronym.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <input type="text" id="acronym" class="form-control form-control-sm w-100" data-bind="value:acronym"/>
        </div>
    </section>
    <section class="form-group row required">
        <div class="col-sm-2"></div>
        <label for="description" class="col-sm-1 form-check-label labelModification">Description: <fc:iconHelp><g:message code="organisation.description.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <textarea type="text" id="description" placeholder="A description of the organisation" class="form-control form-control-sm w-100" data-validation-engine="validate[required]" data-bind="value:description"></textarea>
            <button class="btn btn-sm popup-edit" data-bind="click:editDescription"><i class="fa fa-edit"></i> Edit with Markdown Editor</button>
        </div>
    </section>
    <section class="form-group row">
        <div class="col-sm-2"></div>
        <label for="url" class="col-sm-1 form-check-label labelModification">Web Site URL: <fc:iconHelp><g:message code="organisation.webUrl.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <input type="text" class="form-control form-control-sm w-100" id="url" data-bind="value:url" data-validation-engine="validate[custom[url]]" placeholder="link to your organisations website">
        </div>
    </section>
    <g:render template="/shared/editSocialMediaLinks" model="${[entity: 'organisation', imageUrl: assetPath(src: 'filetypes')]}"></g:render>
    <h4 class="block-header"><g:message code="organisation.images.header"/></h4>
    <section class="form-group row">
        <div class="col-sm-2"></div>
        <label for="logo" class="col-sm-2 form-check-label">Organisation Logo: <fc:iconHelp><g:message code="organisation.logo.help"/></fc:iconHelp></label>
        <div class="col-sm-3" style="text-align:center;background:white">
            <g:message code="organisation.logo.extra"/><br/>
            <div class="well card" style="padding:0;width:200px;height:150px;line-height:146px;display:inline-block">
                <img style="max-width:100%;max-height:100%" alt="No image provided" data-bind="attr:{src:logoUrl}">
            </div>
            <div data-bind="visible:logoUrl()"><g:message code="organisation.logo.visible"/></div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="logo"
                  data-owner-type="organisationId"
                  data-owner-id="${organisation?.organisationId}"
                  data-bind="stagedImageUpload:documents, visible:!logoUrl()"><i class="fa fa-plus"></i>
                <input id="logo" type="file" name="files"><span>Attach</span>
            </span>
            <button class="btn main-image-button" data-bind="click:removeLogoImage, visible:logoUrl()"><i class="fa fa-minus"></i> Remove</button>
        </span>
    </section>
    <section class="form-group row">
        <div class="col-sm-2"></div>
        <label for="logo" class="col-sm-2 form-check-label">Feature Graphic: <fc:iconHelp><g:message code="organisation.mainImage.help"/></fc:iconHelp></label>
        <div class="col-sm-3" style="text-align:center;background:white">
            <div class="well card" style="padding:0;width:200px;height:150px;line-height:146px;display:inline-block; overflow: hidden">
                <img style="max-width:100%;max-height:100%" alt="No image provided" data-bind="attr:{src:mainImageUrl}">
            </div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="mainImage"
                  data-owner-type="organisationId"
                  data-owner-id="${organisation?.organisationId}"
                  data-bind="stagedImageUpload:documents, visible:!mainImageUrl()"><i class="fa fa-plus"></i>
                <input id="mainImage" type="file" name="files"><span>Attach</span>
            </span>
            <button class="btn main-image-button" data-bind="click:removeMainImage, visible:mainImageUrl()"><i class="fa fa-minus"></i> Remove</button>
        </span>
    </section>
</form>
<g:render template="/shared/attachDocument"/>
<g:render template="/shared/markdownEditorModal"/>
