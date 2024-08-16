<form class="validationEngineContainer">
    <h4 class="block-header"><g:message code="organisation.details.header"/></h4>

    <section class="form-group row">
        <label for="abnStatus" class="col-sm-3 form-check-label">ABN Status: <fc:iconHelp><g:message code="organisation.abnStatus.help"/></fc:iconHelp></label>

        <div class="col-sm-7">
            <select type="text" id="abnStatus" class="w-100 form-control form-control-sm" data-bind="value:abnStatus">
                <option value="N/A">N/A</option>
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
    </section>
    <section class="form-group row">
        <label for="abnSelector" class="col-sm-3 form-check-label">ABN: <fc:iconHelp><g:message code="organisation.abn.help"/></fc:iconHelp></label>

            <div class="col-sm-5">
                <input type="text" id="abnSelector" class="w-100 form-control form-control-sm" data-bind="value:abn, valueUpdate: 'input', event:{paste:onPasteAbn}, enable:abnStatus() != 'N/A' && !entityName()" data-validation-engine="validate[custom[number],minSize[11],maxSize[11]" data-validation-error-message="Please enter an 11 digit ABN"  maxlength="11" placeholder="Enter 11 digit ABN"/>
            </div>
            <div class="col-sm-4 prePopBtn">
                <button type="button" id="prepopulateFromABN" data-bind="click:prepopulateFromABN, disable: !(abn())" class="btn btn-sm btn-primary" disabled="disabled">Pre Populate From ABN</button>

                <button type="button" class="btn btn-sm btn-warning" id="clearABN" data-bind="click:clearAbnDetails, enable:entityName()">Clear ABN Details</button>
            </div>
    </section>
    <section class="form-group row">
        <label for="entityName" class="col-sm-3 form-check-label">Entity name: <fc:iconHelp><g:message code="organisation.entityName.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <input type="text" id="entityName" class="w-100 form-control form-control-sm" data-bind="value:entityName, enable:abn()" readonly="readonly"/>
        </div>
    </section>

    <section class="form-group row">
        <label for="businessNames" class="col-sm-3 form-check-label">Business name/s: <fc:iconHelp><g:message code="organisation.businessNames.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <input type="text" id="businessNames" class="w-100 form-control form-control-sm" data-bind="value:businessNames, enable:abn()" readonly="readonly"/>
        </div>
    </section>

    <section class="form-group row">
        <label for="organisationType" class="col-sm-3 form-check-label">Type of organisation: <fc:iconHelp><g:message code="organisation.type.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <select id="organisationType" class="form-control form-control-sm" data-bind="options:entityTypes, optionsCaption:'Please select...', optionsText:'label', optionsValue:'code', value:entityType, enable:abnStatus() == 'N/A'"></select>
        </div>
    </section>

    <section class="form-group row required">

        <label for="name" class="col-sm-3 form-check-label">Name: <fc:iconHelp><g:message code="organisation.name.help"/></fc:iconHelp></label>
        <div class="col-sm-9">
            <input type="text" id="name" class="form-control form-control-sm w-100" data-bind="value:name" data-validation-engine="validate[required]" placeholder="Organisation name">
        </div>
    </section>
    <section class="form-group row">

        <label for="acronym" class="col-sm-3 form-check-label">Acronym: <fc:iconHelp><g:message code="organisation.acronym.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <input type="text" id="acronym" class="form-control form-control-sm w-100" data-bind="value:acronym"/>
        </div>
    </section>

    <section class="form-group row required">
        <label for="description" class="col-sm-3 form-check-label labelModification">Description: <fc:iconHelp><g:message code="organisation.description.help"/></fc:iconHelp></label>
        <div class="col-sm-9">
            <textarea type="text" id="description" placeholder="A description of the organisation" class="form-control form-control-sm w-100" data-validation-engine="validate[required]" data-bind="value:description"></textarea>
            <button class="btn btn-sm popup-edit" data-bind="click:editDescription"><i class="fa fa-edit"></i> Edit with Markdown Editor</button>
        </div>
    </section>
    <section class="form-group row required">
        <label for="state" class="col-sm-3 form-check-label labelModification">State: <fc:iconHelp><g:message code="organisation.state.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <select id="state" class="form-control form-control-sm w-100" data-validation-engine="validate[required]" data-bind="value:state">
                <option value=""></option>
                <option value="ACT">ACT</option>
                <option value="NSW">NSW</option>
                <option value="NT">NT</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="VIC">VIC</option>
                <option value="WA">WA</option>
            </select>
        </div>
    </section>
    <section class="form-group row required">
        <label for="postcode" class="col-sm-3 form-check-label labelModification">Postcode: <fc:iconHelp><g:message code="organisation.postcode.help"/></fc:iconHelp></label>
        <div class="col-sm-3">
            <input type="text" id="postcode" placeholder="The postcode of organisation headquarters" class="form-control form-control-sm" data-validation-engine="validate[required, number,minSize[4],maxSize[4]" data-bind="value:postcode"></input>
        </div>
    </section>

    <section class="form-group row">
            <label class="col-form-label col-sm-3" for="url">External ids: <fc:iconHelp><g:message
                    code="organisation.externalIds.help"/></fc:iconHelp></label>
            <div class="controls col-sm-9">
                <external-ids params="externalIds:externalIds, externalIdTypes:externalIdTypes"></external-ids>
            </div>
    </section>

    <section class="form-group row">
        <label class="col-form-label col-sm-3" for="url">Associated organisations: <fc:iconHelp><g:message
                code="organisation.associatedOrgs.help"/></fc:iconHelp></label>
        <div class="controls col-sm-9">
            <associated-orgs params="associatedOrgs:associatedOrgs, organisationSearchUrl:organisationSearchUrl"></associated-orgs>

        </div>
    </section>

    <section class="form-group row">
        <label for="url" class="col-sm-3 form-check-label labelModification">Web Site URL: <fc:iconHelp><g:message code="organisation.webUrl.help"/></fc:iconHelp></label>
        <div class="col-sm-9">
            <input type="text" class="form-control form-control-sm w-100" id="url" data-bind="value:url" data-validation-engine="validate[custom[url]]" placeholder="link to your organisations website">
        </div>
    </section>
    <g:render template="/shared/editSocialMediaLinks" model="${[entity: 'organisation', imageUrl: assetPath(src: 'filetypes')]}"/>
    <h4 class="block-header"><g:message code="organisation.images.header"/></h4>
    <section class="form-group row">
        <label for="logo" class="col-sm-3 form-check-label">Organisation Logo: <fc:iconHelp><g:message code="organisation.logo.help"/></fc:iconHelp></label>
        <div class="col-sm-6" style="text-align:center;background:white">
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
        <label for="logo" class="col-sm-3 form-check-label">Feature Graphic: <fc:iconHelp><g:message code="organisation.mainImage.help"/></fc:iconHelp></label>
        <div class="col-sm-6" style="text-align:center;background:white">
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
