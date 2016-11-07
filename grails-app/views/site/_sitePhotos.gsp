<%@ page import="au.org.ala.fieldcapture.DateUtils" %>

<div class="photo-slider">

    <ul>
        <g:each in="${photos}" var="image">
            <g:set var="title" value="${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)+" - "+image.name}"/>

            <li>
                <a class="fancybox" rel="group" href="${image.url}" title="${title}" aria-label="Show full size images in popup window"><img src="${image.thumbnailUrl?:image.url}" aria-label="${title ?:"Un-captioned site image"}"/>
                    <p class="caption large"><b>${image.name}</b><br/>
                        <b>Date: </b>${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)}
                        <g:if test="${image.activity}">
                            <br/><b>Activity: </b> ${image.activity.type}
                        </g:if>
                    </p>
                </a>
            </li>
        </g:each>
    </ul>
</div>
