<div id="carousel" class="slider-pro">
	<div class="sp-slides">
		<g:each in="${promotionalProjects}" var="p">
				<g:set var="url" value="${resource(dir: 'images/promotional/', file: p.file)}" />
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
						${p.description}....
					</p>
						
					</g:if>
					
					<!--<g:if test="${p.organisationName}"> 	
						<p class="sp-layer sp-black sp-padding hide-small-screen" 
							data-position="centerCenter" data-vertical="50" 
							data-show-transition="left" data-show-delay="700" data-hide-transition="right" data-hide-delay="200">
							<a href="${grailsApplication.config.grails.serverURL}/project/index/${p.projectId}" target="_blank">${p.organisationName}</a>
						</p>
					</g:if>
					-->
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