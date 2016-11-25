<%@ page import="au.org.ala.fieldcapture.DateUtils" %>

<div class="photo-slider">

    <ul>
        <g:each in="${photos}" var="image" status="i">
            <g:set var="title" value="${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)+" - "+image.name}"/>


            <div id="caption-${i}" style="display:none;">
                <p class="caption large"><b>${image.name}</b>
                    <g:if test="${image.attribution}"><br/> ${image.attribution}</g:if>
                    <br/><b>POI: </b> ${image.poiName}
                    <br/><b>Date taken: </b>${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)}
                    <br/><b>Site: </b> ${image.siteName}
                    <br/><b>Project: </b> ${image.projectName}
                    <g:if test="${image.activity}">
                        <br/><b>Stage: </b> ${image.stage}
                        <br/><b>Activity type: </b> ${image.activity.type}
                        <br/><b>Activity description: </b> ${image.activity.description?:''}
                    </g:if>
                </p>
            </div>
            <li class="thumb">
                <a class="fancybox" rel="group" href="${image.url}" title="${title}" data-caption="caption-${i}" aria-label="Show full size images in popup window"><img src="${image.thumbnailUrl?:image.url}" aria-label="${title ?:"Un-captioned site image"}"/></a>
                <g:set var="activityLink" value="${image.activity?g.createLink(controller: 'activity', action:'index', id:image.activity.activityId):'#'}"/>
                <a href="${activityLink}">
                <div class="caption large">
                    <div style="text-overflow: ellipsis; height: 40px; overflow-y:hidden;"><b>${image.name}</b></div>
                    <b>Date taken: </b>${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)}
                    <g:if test="${image.activity}">
                        ( ${image.stage} )
                        <br/><b>Activity type: </b> ${image.activity.type}
                    </g:if>
                </div>
                </a>
            </li>
        </g:each>
    </ul>
</div>
