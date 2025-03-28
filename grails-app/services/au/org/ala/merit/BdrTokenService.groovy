package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import com.azure.core.credential.AccessToken
import com.azure.core.credential.TokenRequestContext
import com.azure.core.implementation.AccessTokenCache
import com.azure.identity.ClientAssertionCredential
import com.azure.identity.ClientAssertionCredentialBuilder
import com.nimbusds.jwt.JWT
import grails.core.GrailsApplication
import org.pac4j.oidc.profile.OidcProfile
import software.amazon.awssdk.services.cognitoidentity.CognitoIdentityClient
import software.amazon.awssdk.services.cognitoidentity.model.GetIdRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetIdResponse
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenResponse

import javax.annotation.PostConstruct

/**
 * The BdrTokenService is responsible for obtaining a bearer token we can present to the BDR API.
 *
 * Obtaining the token is a two step process:
 * 1. We obtain a token from CAS/Cognito with a known subject/audience and issuer.
 * 2. We present this to the Azure authentication endpoint to obtain a token we can use to authenticate with the BDR.
 * The current implementation uses a token from CAS as the environment isn't setup correctly at the moment
 * to be able to get a token from Cognito.
 */
class BdrTokenService {

    GrailsApplication grailsApplication
    TokenService oidcBdrTokenService
    AccessTokenCache accessTokenCache


    String getBDRAccessToken() {
        // Scope to request when authenticating with Azure
        String azureApiAccessScope = grailsApplication.config.getProperty('bdr.azure.apiScope')

        TokenRequestContext tokenRequestContext = new TokenRequestContext()
        tokenRequestContext.addScopes(azureApiAccessScope)

        AccessToken accessToken = accessTokenCache.getTokenSync(tokenRequestContext, false)
        accessToken.getToken()
    }

    /**
     * The way MERIT authenticates with the BDR is via an Azure federated identity.
     * MERIT exchanges a token with known subject and audience claims for an Azure token.
     * @param alaToken the ALA token to exchange for a BDR token
     * @return the Azure token
     */
    @PostConstruct
    private void buildAzureAccessTokenCache() {

        String azureTenantId = grailsApplication.config.getProperty('bdr.azure.tenantId')
        String azureClientId = grailsApplication.config.getProperty('bdr.azure.clientId')

        ClientAssertionCredential credentials = new ClientAssertionCredentialBuilder()
                .tenantId(azureTenantId)
                .clientId(azureClientId)
                .clientAssertion { getCASAuthToken() }
                .build()

        accessTokenCache = new AccessTokenCache(credentials)

    }

    /**
     * An OIDC client has been setup in CAS with a client credentials grant which will return
     * an access token with known scope and audience we can use to authenticate with the BDR Azure instance.
     * @return
     */
    private String getCASAuthToken() {
        oidcBdrTokenService.getAuthToken(false)?.getValue()
    }


    /**
     * Azure requires an access token with known subject and audience claims to be exchanged for a token.
     * The only way to do this in Cognito is to use the Cognito Identity Pool as Cognito access tokens
     * don't have an audience claim and you can't get an id token without a user pool.
     */
    private String getCognitoAuthToken() {

        OidcProfile oidcProfile = oidcBdrTokenService.profileManager.getProfile(OidcProfile).orElse(null)
        JWT idTokenJWT = oidcProfile.getIdToken()
        String idToken = idTokenJWT.serialize()
        CognitoIdentityClient client = CognitoIdentityClient.builder().build()

        String identityPoolId = grailsApplication.config.getProperty('bdr.cognito.identityPoolId')
        String identityProvider = "" // Extract from token iss claim minus https:// prefix
        GetIdRequest getIdRequest = GetIdRequest.builder()
                .identityPoolId(identityPoolId)
                .logins((identityProvider):idToken).build()
        GetIdResponse getIdResponse = client.getId(getIdRequest)
        String identityId = getIdResponse.identityId()
        GetOpenIdTokenRequest request = GetOpenIdTokenRequest.builder()
                .identityId(identityId)
                .logins((identityProvider):idToken).build()

        GetOpenIdTokenResponse getOpenIdTokenResponse = client.getOpenIdToken(request)
        String accessToken = getOpenIdTokenResponse.token()

//        GetCredentialsForIdentityRequest credentialsRequest = GetCredentialsForIdentityRequest.builder()
//                .identityId(identityId)
//                .logins("cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_OOXU9GW39":idToken).build()
//
//        GetCredentialsForIdentityResponse credentialsResponse = client.getCredentialsForIdentity(credentialsRequest)
//        Credentials credentials = credentialsResponse.credentials()
//
//        String accessToken = credentials.sessionToken()

        accessToken
    }
}
