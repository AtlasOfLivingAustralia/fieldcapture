<div id="carousel" class="slider-pro row" data-bind="visible:mainImageUrl()" style="margin-bottom:20px;">
    <div class="sp-slides">
        <div class="sp-slide">
            <img class="sp-image" data-bind="attr:{'data-src':mainImageUrl}"/>
            <p class="sp-layer sp-white sp-padding"
               data-position="topLeft" data-width="100%" data-bind="visible:url"
               data-show-transition="down" data-show-delay="0" data-hide-transition="up">
                <strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong>
            </p>
        </div>
    </div>
</div>

<div id="weburl" data-bind="visible:!mainImageUrl()">
    <div data-bind="visible:url()"><strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong></div>
</div>

<div data-bind="visible:description">
    <div class="card customCard">
        <div class="card-title">About ${organisation.name?.encodeAsHTML()}</div>

        <span id="orgDescription" data-bind="html:description.markdownToHtml()"></span>

        <div class="row">
            <div class="col-6">
                <g:if test="${organisation.abn}">
                    <p>ABN: <span id="orgAbn">${organisation.abn}</span></p>
                </g:if>
                <g:if test="${organisation.state}">
                    <p>State: ${organisation.state}</p>
                </g:if>
                <g:if test="${organisation.postcode}">
                    <p>Postcode: ${organisation.postcode}</p>
                </g:if>
            </div>

            <div class="col-6">
                <g:if test="${organisation.orgType}">
                    <p>Organisation type: ${organisation.orgType}</p>
                </g:if>
                <g:if test="${organisation.contractNames}">
                    <g:each in="${organisation.contractNames}" var="name">
                        <p>Contracted recipient name: ${name}</p>
                    </g:each>
                </g:if>

                <g:if test="${organisation.indigenousOrganisationRegistration}">
                    <p>Indigenous registration:
                        <g:each in="${organisation.indigenousOrganisationRegistration}" var="indigenousOrg">
                            <span>${indigenousOrg}</span><br/>
                        </g:each>
                    </p>
                </g:if>



                <!-- ko foreach:associatedOrgs() -->
                <div class="row">
                    <div class="col-sm-4 header-label" data-bind="text:$data.description"></div>

                    <div class="col-sm-8 organisationName">
                        <a data-bind="visible:ko.utils.unwrapObservable($data.organisationId),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+ko.utils.unwrapObservable($data.organisationId)}">
                            <span data-bind="text:$data.name"></span>
                        </a>
                        <span data-bind="visible:!ko.utils.unwrapObservable($data.organisationId),text:$data.name"></span>
                    </div>
                </div>
                <!-- /ko -->

                <g:each in="${organisation.externalIds?.collect{it.idType}?.unique()}" var="externalIdType">
                    <div class="row mb-2">
                        <div class="col-sm-4 header-label"><g:message code="${'label.externalId.'+externalIdType}"/>:</div>
                        <div class="col-sm-8 external-id"><fc:externalIds externalIds="${organisation.externalIds}" idType="${externalIdType}"/></div>

                    </div>
                </g:each>
            </div>
        </div>

    </div>
</div>

<g:render template="/shared/projectsByProgram"
          model="${[primaryOutcomesTitle:'The organisation is addressing these primary outcomes',
                    secondaryOutcomesTitle:'The organisation is addressing these secondary outcomes']}"
/>
