
<form class="validationEngineContainer">

    <h4 class="block-header"><g:message code="managementUnit.details.header"/></h4>

    <div class="form-group row required">
        <label class="col-form-label col-sm-3" for="name">Name: <fc:iconHelp><g:message
                code="managementUnit.name.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <input type="text" id="name" class="form-control" data-bind="value:name"
                   data-validation-engine="validate[required]"
                   placeholder="${g.message(code: 'managementUnit.name.placeholder')}" ${!isNameEditable ? 'readonly="readonly"' : ''}>
        </div>
    </div>

    <div class="form-group row required">
        <label class="col-form-label col-sm-3" for="description">Description: <fc:iconHelp><g:message
                code="managementUnit.description.help"/></fc:iconHelp></label>

        <div class="col-sm-9">
            <textarea rows="3" class="form-control" data-bind="value:description"
                      data-validation-engine="validate[required]" id="description"
                      placeholder="${g.message(code: 'managementUnit.description.placeholder')}"></textarea>
            <br/><button class="btn popup-edit" data-bind="click:editDescription"><i
                class="icon-edit"></i> Edit with Markdown Editor</button>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="url">Web Site URL: <fc:iconHelp><g:message
                code="managementUnit.webUrl.help"/></fc:iconHelp></label>

        <div class="controls col-sm-9">
            <input type="text" class="form-control" id="url" data-bind="value:url"
                   data-validation-engine="validate[custom[url]]"
                   placeholder="${g.message(code: 'managementUnit.webUrl.placeholder')}">
        </div>
    </div>
    <g:render template="/shared/editSocialMediaLinks"
              model="${[entity: 'program', imageUrl: assetPath(src: 'filetypes')]}"/>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="serviceProviderName">Service provider organisation name: <fc:iconHelp><g:message
                code="managementUnit.webUrl.help"/></fc:iconHelp></label>

        <div class="controls col-sm-4">
            <input type="text" class="form-control" readonly="readonly" data-bind="value: associatedOrganisations()[0].name" id="serviceProviderName">
            %{--this custom binding cannot deal with observableArray transients.selectServiceProviderOrganisation--}%
            <input type="text" class="input-xlarge form-control hidden" id="organisationSelection" placeholder="Search organisations..."
                   data-bind="elasticSearchAutocomplete:{url:fcConfig.organisationSearchUrl, value:'name', label:'name',result:transients.selectServiceProviderOrganisation, callback:applyServiceProviderSelection}"/>

        </div>
        <div class="controls col-sm-1">
          <button class="btn" type="button" id="editServiceProvider">Edit</button>
        </div>


</div>




    <h4 class="block-header"><g:message code="managementUnit.images.header"/></h4>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="logo">Management Unit Logo: <fc:iconHelp><g:message
                code="managementUnit.logo.help"/></fc:iconHelp>:</label>

        <div class="col-sm-6" style="text-align:center;background:white">
            <g:message code="managementUnit.logo.extra"/><br/>

            <div class="well" style="padding:0;width:200px;height:150px;line-height:146px;display:inline-block">
                <img style="max-width:100%;max-height:100%" data-bind="attr:{src:logoUrl()}">
            </div>

            <div data-bind="visible:logoUrl()"><g:message code="organisation.logo.visible"/></div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="logo"
                  data-owner-type="managementUnitId"
                  data-owner-id="${managementUnit?.managementUnitId}"
                  data-bind="stagedImageUpload:documents, visible:!logoUrlProvided()"><i class="icon-plus"></i> <input
                    id="logo" type="file" name="files"><span>Attach</span></span>

            <button class="btn main-image-button float-right" data-bind="click:removeLogoImage, visible:logoUrlProvided()"><i
                    class="icon-minus"></i> Remove</button>
        </span>
    </div>

    <div class="form-group row">
        <label class="col-form-label col-sm-3" for="mainImage">Feature Graphic<fc:iconHelp><g:message
                code="managementUnit.breadcrumb.create"/></fc:iconHelp>:</label>

        <div class="col-sm-6" style="text-align:center;background:white">
            <div class="well" style="padding:0;max-height:512px;display:inline-block;overflow:hidden">
                <img style="width:100%" alt="No image provided" data-bind="attr:{src:mainImageUrl}">
            </div>
        </div>
        <span class="col-sm-3">
            <span class="btn fileinput-button pull-right"
                  data-url="${createLink(controller: 'image', action: 'upload')}"
                  data-role="mainImage"
                  data-owner-type="managementUnitId"
                  data-owner-id="${managementUnit?.managementUnitId}"
                  data-bind="stagedImageUpload:documents, visible:!mainImageUrl()"><i class="icon-plus"></i> <input
                    id="mainImage" type="file" name="files"><span>Attach</span></span>

            <button class="btn main-image-button float-right" data-bind="click:removeMainImage,  visible:mainImageUrl()"><i
                    class="icon-minus"></i> Remove</button>
        </span>
    </div>

</form>
<g:render template="/shared/attachDocument"/>
<g:render template="/shared/markdownEditorModal"/>

<asset:script>

    function applyServiceProviderSelection(){
       $('button#editServiceProvider').click()
    };

   $('button#editServiceProvider').click(function(e){
     if (e.target.textContent == 'Edit'){
         $('input#organisationSelection').removeClass('hidden')
         $('input#serviceProviderName').addClass('hidden')
         e.target.textContent = 'Cancel'
     }else if (e.target.textContent == 'Cancel'){
         $('input#organisationSelection').addClass('hidden')
         $('input#serviceProviderName').removeClass('hidden')
         e.target.textContent = 'Edit'
     }
   })



</asset:script>