<div class="well" >
    <div class="row-fluid" data-bind="visible:organisation()||organisationName()">
        <div class="span2 text-left">
            <b>Recipient:</b>
        </div>
        <div class="span10 text-left">
            <a data-bind="visible:organisation(),text:transients.collectoryOrgName,attr:{href:fcConfig.organisationLinkBaseUrl + organisation()}"></a>
            <span data-bind="visible:organisationName(),text:organisationName"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:serviceProviderName()">
        <div class="span2 text-left">
            <b> Service provider:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:serviceProviderName"></span>
        </div>
    </div>
    <div class="row-fluid" data-bind="visible:associatedProgram()">
        <div class="span2 text-left">
             <b>Programme:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:associatedProgram"></span>
            <span data-bind="text:associatedSubProgram"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:funding()">
        <div class="span2 text-left">
            <b>Approved funding </b> <small>(GST inclusive)</small> :
        </div>
        <div class="span10 text-left">
            <span data-bind="text:funding.formattedCurrency"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:plannedStartDate()">
        <div class="span2 text-left">
            <b>Project start:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:plannedStartDate.formattedDate"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:plannedStartDate()">
        <div class="span2 text-left">
            <b>Project finish:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="visible:plannedEndDate()"><span data-bind="text:plannedEndDate.formattedDate"></span></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:grantId" style="margin-bottom: 0">
        <div class="span2 text-left">
            <b>Grant Id:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:grantId"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:externalId" style="margin-bottom: 0">
        <div class="span2 text-left">
            <b>Manager:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:externalId"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:manager" style="margin-bottom: 0">
        <div class="span2 text-left">
            <b>Manager:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="text:manager"></span>
        </div>
    </div>

    <div class="row-fluid" data-bind="visible:description()" style="margin-bottom: 0">
        <div class="span2 text-left">
            <b>Description:</b>
        </div>
        <div class="span10 text-left">
            <p class="more" data-bind="text:description"></p>
        </div>
    </div>

    <div class="row-fluid" >
        <div class="span2 text-left">
            <b>Status:</b>
        </div>
        <div class="span10 text-left">
            <span data-bind="visible:status" style="margin-bottom: 0">
                <span data-bind="if: status().toLowerCase() == 'active'">
                    <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-success" style="font-size: 13px;"></span>
                </span>
                <span data-bind="if: status().toLowerCase() == 'completed'">
                    <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-info" style="font-size: 13px;"></span>
                </span>
            </span>
        </div>
    </div>

    <div class="row-fluid" >
        <div class="span2 text-left"></div>
        <div class="span10 text-left">
            <div id="gallery" class="light-box zoom-gallery">
                <div data-bind="visible:primaryImages() !== null, foreach: primaryImages">
                    <a class="mfp-image" data-bind="attr:{href: url, title: (name() ? name() : '') + '</br>' + (attribution() ? attribution() : '') }">
                        <img height="200" width= "200" class="img-responsive" data-bind="attr:{src:thumbnailUrl, alt:name}" alt="">
                    </a>
                </div>
            </div>

        </div>
    </div>

</div>

<div data-bind="if: iframes().length > 0">
    <div class="row-fluid">
        <div class="span12 text-left">
            <div data-bind="foreach: iframes">
                <span data-bind="html: code"></span> &nbsp;
            </div>
        </br></br>
        </div>

    </div>
</div>

<div data-bind="if: newsAndEvents">
    <div class="well" >
        <div class="row-fluid" data-bind="visible:newsAndEvents()">
            <div class="span12 text-left">
                <h4>News and events:</h4>
                <p id="newsAndEventsDiv" class="more" data-bind="html:newsAndEvents"></p>
            </br>
            </div>
        </div>
    </div>
</div>

<div data-bind="if: projectStories">
    <div class="well">
        <div class="row-fluid" data-bind="visible:projectStories()">
            <div class="span12 text-left">
                <h4>Stories:</h4>
                <p id="projectStoriesDiv"  class="more" data-bind="html:projectStories"></p>
            </div>
        </div>
    </div>
</div>

<r:script>
    $(function() {
        $('.zoom-gallery').magnificPopup({
            delegate: 'a',
            gallery: {
                enabled: true
            },

            zoom : {
                enabled: true,
                duration: 300, // don't forget to change the duration also in CSS
                opener: function(element) {
                    return element.find('img');
                }
            },
            image: {
                titleSrc: 'title'
            }

        });


    });
</r:script>