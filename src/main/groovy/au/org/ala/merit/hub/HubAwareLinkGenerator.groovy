package au.org.ala.merit.hub

import asset.pipeline.grails.AssetProcessorService
import asset.pipeline.grails.AssetSupportingCachingLinkGenerator
import org.grails.web.servlet.mvc.GrailsWebRequest

/**
 * Overrides the grails CachingLinkGenerator to always add the hub parameter (if the user is viewing a hub)
 * to the call to generate the link.  This is to allow the URLMappings containing the hub to be selected in
 * preference to the defaults.
 *
 * This extends the asset-pipeline supplied link generator as the asset-pipeline plugin relies on replacing the
 * grailsLinkGenerator bean in order to inject itself into the AssetProcessorService.
 */
class HubAwareLinkGenerator extends AssetSupportingCachingLinkGenerator {

    HubAwareLinkGenerator(String serverBaseUrl, AssetProcessorService assetProcessorService) {
        super(serverBaseUrl, assetProcessorService)
    }

    @Override
    public String link(Map attrs, String encoding) {
        addHubToParams(attrs)
        super.link(attrs, encoding)
    }

    private void addHubToParams(attrs) {
        GrailsWebRequest request = GrailsWebRequest.lookup()
        if (request && request.params.hub) {
            def params = attrs.params ?:[:]
            if (!params.hub) {
                params.hub = request.params.hub
                attrs.params = params
            }
        }
    }
}
