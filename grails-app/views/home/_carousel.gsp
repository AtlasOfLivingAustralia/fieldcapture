<div style="display:none" id="carousel" class="slider-pro">
	<div class="sp-slides">
		<g:each in="${promotionalProjects}" var="p">
				<!--  Use this image, in case  if client wants to promote the project that has no primary project image. -->
				<g:set var="url" value="${resource(dir: 'images/promotional/'+((int)10 + Math.random() * 3)+'.jpg')}" />
				
				<g:each in="${p.documents}" var="doc">
					<g:if test="${doc.isPrimaryProjectImage}">
						<g:set var="url" value="${doc.url}" />
					</g:if>
				</g:each>
				
				<div class="sp-slide">
					 <img class="sp-image" data-src="${url}"/>
					<g:if test="${p.description}"> 	
						 
					<p class="sp-layer sp-white sp-padding" 
						data-vertical="10" data-horizontal="2%" data-width="96%" 
						data-show-transition="down" data-show-delay="400" data-hide-transition="up">
						${p.description} <a target="_blank" href="${grailsApplication.config.grails.serverURL}/project/index/${p.projectId}">more...</a>
					</p>
					<p class="sp-layer sp-black sp-padding" 
						data-position="centerLeft"  data-horizontal="2%" data-vertical="-50" 
						data-show-transition="right" data-hide-transition="left" data-show-delay="500" >
						${p.organisationName}
					</p>
						
					</g:if>
				</div>
		</g:each>
	</div>
	<div class="sp-thumbnails">
		 <g:each in="${promotionalProjects}" var="p">
			<div class="sp-thumbnail">
		 		<div class="sp-thumbnail-description">${p.name}</div>
		 	</div>	
		 </g:each>
	</div>
</div>