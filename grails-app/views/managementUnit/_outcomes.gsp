<div class="well">
    <div class="well-title">${title}</div>
    <div class="row outcomes ${type} no-gutters">
        <g:each in="${outcomes}" var="outcome" >
            <g:set var="outcomeClass" value="${outcome.targeted ? 'targeted' :''}"/>
            <div class="col-md">
                <div class="outcome-wrapper h-100">
                    <div class="h-100 outcome ${outcomeClass}">
                        ${outcome.shortDescription}
                    </div>
                </div>
            </div>
        </g:each>
    </div>
</div>