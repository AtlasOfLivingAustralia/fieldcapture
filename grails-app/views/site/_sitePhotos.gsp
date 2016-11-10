<%@ page import="au.org.ala.fieldcapture.DateUtils" %>

<div class="photo-slider">

    <ul>
        <g:each in="${photos}" var="image" status="i">
            <g:set var="title" value="${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)+" - "+image.name}"/>

            <g:set var="content">
                <p class="caption large"><b>${image.name}</b><br/>
                    <b>Date taken: </b>${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)}
                    <g:if test="${image.activity}">
                        ( ${image.stage} )
                        <br/><b>Activity: </b> ${image.activity.type}
                    </g:if>
                </p>
            </g:set>
            <div id="caption-${i}" style="display:none;">
                ${content}
            </div>
            <li>
                <a class="fancybox" rel="group" href="${image.url}" title="${title}" data-caption="caption-${i}" aria-label="Show full size images in popup window"><img src="${image.thumbnailUrl?:image.url}" aria-label="${title ?:"Un-captioned site image"}"/></a>
                <g:set var="activityLink" value="${image.activity?g.createLink(controller: 'activity', action:'index', id:image.activity.activityId):'#'}"/>
                <a href="${activityLink}">
                    ${content}
                </a>
            </li>
        </g:each>
    </ul>
</div>
