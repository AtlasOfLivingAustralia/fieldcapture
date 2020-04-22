<form class="validationEngineContainer">

    <h4 class="block-header"><g:message code="program.details.header"/></h4>

    <g:if test="${fc.userIsAlaOrFcAdmin() && editProgramId != null}">
        <div class="form-group row">
            <label for="newParentProgramId" class="col-form-label col-sm-3">
                Parent Program:
            </label>
            <div class="col-md-9">
                <span class="select2">
                   <g:select class="newParentProgramId" style="width: 100%" from="${allProgram}" data-bind="value:newParentProgramId" optionKey="programId" name="name" id="newParentProgramId" optionValue="name" noSelection="${['null' : 'No Parent']}"/>
                </span>
            </div>

        </div>
    </g:if>
    <g:elseif test="${program.parentProgramId != null}">
    <div class="form-group row">
        <label for="parentProgramId" class="col-form-label col-sm-3">
            Parent Program:
        </label>
        <div class="col-sm-9">
            <select name="parentProgramId" id="parentProgramId" data-bind="value:parentProgramId" class="form-control"
                    data-validation-engine="validate[required]" disabled="disabled">
                <option value="${program.parentProgramId}">${program.parentProgram}</option>
            </select>
        </div>
    </div>
</g:elseif>
      <div class="form-group row required">
        <label class="col-form-label col-sm-3" for="name">Name: <fc:iconHelp><g:message
                code="program.name.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <input type="text" id="name" class="form-control" data-bind="value:name"
                   data-validation-engine="validate[required]"
                   placeholder="${g.message(code: 'program.name.placeholder')}">
        </div>
    </div>

    <div class="form-group row required">
        <label class="col-form-label col-sm-3" for="description">Description: <fc:iconHelp><g:message
                code="program.description.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <textarea rows="3" class="form-control" data-bind="value:description"
                      data-validation-engine="validate[required]" id="description"
                      placeholder="${g.message(code: 'program.description.placeholder')}"></textarea>
            <br/><button class="btn popup-edit" data-bind="click:editDescription"><i
                class="icon-edit"></i> Edit with Markdown Editor</button>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="url">Web Site URL: <fc:iconHelp><g:message
                code="program.webUrl.help"/></fc:iconHelp></label>

        <div class="controls col-sm-9">
            <input type="text" class="form-control" id="url" data-bind="value:url"
                   data-validation-engine="validate[custom[url]]"
                   placeholder="${g.message(code: 'program.webUrl.placeholder')}">
        </div>
    </div>
    <g:render template="/shared/editSocialMediaLinks"
              model="${[entity: 'program', imageUrl: assetPath(src: 'filetypes')]}"/>



    <h4 class="block-header"><g:message code="program.images.header"/></h4>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="logo">Program Logo: <fc:iconHelp><g:message
                code="program.logo.help"/></fc:iconHelp>:</label>

        <div class="col-sm-6" style="text-align:center;background:white">
            <g:message code="program.logo.extra"/><br/>

            <div class="well" style="padding:0;width:200px;height:150px;line-height:146px;display:inline-block">
                <img style="max-width:100%;max-height:100%" data-bind="attr:{src:logoUrl()}">
            </div>

            <div data-bind="visible:logoUrl()"><g:message code="organisation.logo.visible"/></div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="logo"
                  data-owner-type="programId"
                  data-owner-id="${program?.programId}"
                  data-bind="stagedImageUpload:documents, visible:!logoUrlProvided()"><i class="icon-plus"></i> <input
                    id="logo" type="file" name="files"><span>Attach</span></span>

            <button class="btn main-image-button" data-bind="click:removeLogoImage, visible:logoUrlProvided()"><i
                    class="icon-minus"></i> Remove</button>
        </span>
    </div>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="mainImage">Feature Graphic<fc:iconHelp><g:message
                code="program.mainImage.help"/></fc:iconHelp>:</label>

        <div class="col-sm-6" style="text-align:center;background:white">
            <div class="well" style="padding:0;max-height:512px;display:inline-block;overflow:hidden">
                <img style="width:100%" alt="No image provided" data-bind="attr:{src:mainImageUrl}">
            </div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="mainImage"
                  data-owner-type="programId"
                  data-owner-id="${program?.programId}"
                  data-bind="stagedImageUpload:documents, visible:!mainImageUrl()"><i class="icon-plus"></i> <input
                    id="mainImage" type="file" name="files"><span>Attach</span></span>

            <button class="btn main-image-button" data-bind="click:removeMainImage,  visible:mainImageUrl()"><i
                    class="icon-minus"></i> Remove</button>
        </span>
    </div>

</form>
<g:render template="/shared/attachDocument"/>
<g:render template="/shared/markdownEditorModal"/>
