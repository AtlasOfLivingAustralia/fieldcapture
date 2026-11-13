package au.org.ala.merit.config

import au.org.ala.ws.tokens.TokenClient
import au.org.ala.ws.tokens.TokenService
import com.nimbusds.jose.util.ResourceRetriever
import org.pac4j.core.context.session.SessionStoreFactory
import org.pac4j.oidc.config.OidcConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/** A copy of the AlaWsPluginConfig used to create a TokenService for use for calls to the BDR */
@Configuration("bdrTokenConfig")
class BdrTokenConfig {

    @Value('${bdr.client-id}')
    String clientId

    @Value('${bdr.client-secret}')
    String clientSecret

    @Value('${bdr.jwt-scopes}')
    String jwtScopes

    @Value('${bdr.cache-tokens:true}')
    boolean cacheTokens

    @Value('${bdr.discovery-uri}')
    String discoveryUri

    // To allow mocking of the OIDC configuration for testing, we allow unsigned tokens to be used if the property is set to true. This should not be used in production.
    @Value('${bdr.allowUnsignedIdTokens:false}')
    boolean allowUnsignedIdTokens

    @Bean(defaultCandidate = false)
    OidcConfiguration bdrOidcConfiguration(@Qualifier("oidcResourceRetriever") ResourceRetriever jwtResourceRetriever) {
        OidcConfiguration config = new OidcConfiguration()
        config.setClientId(clientId)
        config.setSecret(clientSecret)
        config.setDiscoveryURI(discoveryUri)
        config.setAllowUnsignedIdTokens(allowUnsignedIdTokens)

        config.setResourceRetriever(jwtResourceRetriever)
        config.init()
        return config
    }

    @Bean(defaultCandidate = false)
    TokenClient bdrTokenClient(
            @Qualifier("bdrOidcConfiguration") OidcConfiguration bdrOidcConfiguration
    ) {
        new TokenClient(bdrOidcConfiguration)
    }

    @Bean(defaultCandidate = false)
    TokenService oidcBdrTokenService(
            @Qualifier("bdrOidcConfiguration") OidcConfiguration bdrOidcConfiguration,
            @Autowired(required = false) SessionStoreFactory sessionStoreFactory,
            @Qualifier("bdrTokenClient") TokenClient tokenClient
    ) {
        // The cast selects the SessionStoreFactory constructor if no factory is available
        new TokenService(bdrOidcConfiguration,
                (SessionStoreFactory) sessionStoreFactory, tokenClient, clientId, clientSecret, jwtScopes, cacheTokens)
    }

}
