<div class="organisation-header banner" data-bind="style:{'backgroundImage':asBackgroundImage(bannerUrl())}">
<div aria-label="breadcrumb">
    <ol class="breadcrumb">
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
    <div class="banner">
    <span data-bind="visible:logoUrl"><img class="logo" data-bind="attr:{'src':logoUrl}"></span>
    <div class="pull-right" style="vertical-align: middle;">
        <span data-bind="foreach:transients.socialMedia">
            <a data-bind="attr:{href:link.url}"><img data-bind="attr:{src:logo('${assetPath(src: 'filetypes')}')}"/>
            </a>
        </span>
    </div>
    <div class="header-text">
        <h2>${organisation.name?.encodeAsHTML()}</h2>
    </div>

    </div>
</div>
