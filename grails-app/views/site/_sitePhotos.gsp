<%@ page import="au.org.ala.fieldcapture.DateUtils" %>

<div class="photo-slider">

    <ul>
        <g:each in="${photos}" var="image">
            <li>

                    <a class="fancybox" rel="group" href="${image.url}" aria-label="Show full size images in popup window"><img src="${image.thumbnailUrl?:image.url}" aria-label="${image.name?:"Un-captioned site image"}"/>
                        <p class="caption"><fc:truncate value="${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(image.dateTaken)+" - "+image.name}" maxLength="40"/></p></a>



            </li>

        </g:each>

    </ul>
</div>
