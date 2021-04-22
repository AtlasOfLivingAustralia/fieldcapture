<div class="organisation-header banner" data-bind="style:{'backgroundImage':asBackgroundImage(bannerUrl())}">
<div aria-label="breadcrumb">
    <ol class="breadcrumb ml-3">
        <li class="breadcrumb-item">
            <g:link controller="home">Home</g:link>
        </li>
        <li class="breadcrumb-item">
            <g:link controller="organisation" action="list">Organisations</g:link>
        </li>
        <li class="breadcrumb-item">
            ${organisation.name?.encodeAsHTML()}
        </li>
    </ol>
</div>
    <div class="row">
        <div class="col-sm-2 mr-2" data-bind="visible:logoUrl">
            <img class="logo ml-2" data-bind="attr:{'src':logoUrl}">
        </div>
        <div class="col-sm-4 ml-5" data-bind="visible:logoUrl">
            <h2>${organisation.name?.encodeAsHTML()}</h2>
        </div>
        <div class="col-sm-4" data-bind="visible:!logoUrl()">
            <h2>${organisation.name?.encodeAsHTML()}</h2>
        </div>
        <div class="col-sm-5 ml-6 float-right" data-bind="visible:logoUrl">
            <span data-bind="foreach:transients.socialMedia" class="float-right">
                <a data-bind="attr:{href:link.url}" class="text-right"><img data-bind="attr:{src:logo('${imageUrl}')}"/></a>
            </span>
        </div>
        <div class="col-sm-8" data-bind="visible:!logoUrl()">
            <span data-bind="foreach:transients.socialMedia" class="float-right">
                <a data-bind="attr:{href:link.url}" class="text-right"><img data-bind="attr:{src:logo('${imageUrl}')}"/></a>
            </span>
        </div>
%{--       <span data-bind="visible:logoUrl"></span>--}%
%{--        <div class="pull-right float-right" style="vertical-align: middle;">--}%
%{--            <span data-bind="foreach:transients.socialMedia" class="float-right">--}%
%{--                <a data-bind="attr:{href:link.url}" class="text-right"><img data-bind="attr:{src:logo('${imageUrl}')}"/></a>--}%
%{--            </span>--}%
%{--        </div>--}%
%{--        <div class="header-text ml-3">--}%
%{--            <h2>${organisation.name?.encodeAsHTML()}</h2>--}%
%{--        </div>--}%
    </div>
</div>
