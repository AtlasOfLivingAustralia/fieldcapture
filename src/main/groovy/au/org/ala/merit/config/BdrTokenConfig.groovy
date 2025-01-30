package au.org.ala.merit.config

import au.org.ala.ws.tokens.TokenClient
import au.org.ala.ws.tokens.TokenService
import org.pac4j.core.context.session.SessionStore
import org.pac4j.oidc.config.OidcConfiguration
import org.springframework.beans.factory.annotation.Autowired
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

    @Bean
    OidcConfiguration bdrOidcConfiguration() {
        OidcConfiguration config = new OidcConfiguration()
        config.setClientId(clientId)
        config.setSecret(clientSecret)
        config.setDiscoveryURI(discoveryUri)

        return config
    }

    @Bean
    TokenClient bdrTokenClient(
            @Autowired(required = false) OidcConfiguration bdrOidcConfiguration
    ) {
        new TokenClient(bdrOidcConfiguration)
    }

    @Bean
    TokenService bdrTokenService(
            @Autowired(required = false) OidcConfiguration bdrOidcConfiguration,
            @Autowired(required = false) SessionStore sessionStore,
            @Autowired TokenClient tokenClient
    ) {
        new TokenService(bdrOidcConfiguration,
                sessionStore, tokenClient, clientId, clientSecret, jwtScopes, cacheTokens)
    }

}
