<div data-bind="visible:mainImageUrl()">
    <img data-bind="attr:{'src':mainImageUrl}" class="img-fluid" alt="banner image"/>
</div>
<div id="weburl" data-bind="visible:!mainImageUrl() && url()">
    <div data-bind="visible:url()"><strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong></div>
</div>

<div class="row">
    <div class="col-md-12 ">
        <div class="well-title ">Description</div>
    </div>
    <div class="col-md-8" >
        <span data-bind="html:description.markdownToHtml()"></span>
    </div>
    <div data-bind="visible:managementUnitSiteId" class="col-md-4">
        <m:map id="managementUnitSiteMap" width="100%" height="300px"></m:map>
    </div>
</div>

<g:render template="/shared/projectsByProgram"
          model="${[primaryOutcomesTitle:'The Service Provider is addressing these primary outcomes',
                    secondaryOutcomesTitle:'The Service Provider is addressing these secondary outcomes']}"/>

