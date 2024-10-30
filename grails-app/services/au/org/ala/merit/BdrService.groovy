package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import com.azure.core.credential.AccessToken
import com.azure.core.credential.TokenRequestContext
import com.azure.identity.ClientAssertionCredentialBuilder
import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClient
import com.azure.storage.blob.BlobServiceClientBuilder
import com.nimbusds.jwt.JWT
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import com.azure.identity.ClientAssertionCredential
import org.pac4j.oidc.profile.OidcProfile
import software.amazon.awssdk.services.cognitoidentity.CognitoIdentityClient
import software.amazon.awssdk.services.cognitoidentity.model.GetIdRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetIdResponse
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenResponse

import javax.servlet.http.HttpServletResponse

/**
 * Interface to the BDR system - used to retrieve data submitted for MERIT projects via the Monitor application.
 */
@Slf4j
class BdrService {

    GrailsApplication grailsApplication
    WebService webService
    TokenService tokenService

    TokenService bdrTokenService

    void downloadDataSet(String dataSetId, String format, HttpServletResponse response) {
        String bdrBaseUrl = grailsApplication.config.getProperty('bdr.api.url')

        format = format ?: 'json'
        String url = bdrBaseUrl+'/ns3:'+dataSetId+'/items?_mediatype=application%2Fgeo%2Bjson'

        String token = bdrTokenService.getAuthToken(false)

        String azureToken = getAzureAccessToken(token)

        log.info("Downloading data set from BDR: $url")

        webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, null, azureToken)
    }

    /**
     * The way MERIT authenticates with the BDR is via an Azure federated identity.
     * MERIT exchanges a token with known subject and audience claims for an Azure token.
     * @param alaToken the ALA token to exchange for a BDR token
     * @return the Azure token
     */
    private String getAzureAccessToken(String alaToken) {

        String azureTenantId = grailsApplication.config.getProperty('bdr.azure.tenantId')
        String azureClientId = grailsApplication.config.getProperty('bdr.azure.clientId')
        // Scope to request when authenticating with Azure
        String azureApiAccessScope = grailsApplication.config.getProperty('bdr.azure.apiScope')

        ClientAssertionCredential credentials = new ClientAssertionCredentialBuilder()
                .tenantId(azureTenantId)
                .clientId(azureClientId)
                .clientAssertion { alaToken }
                .build()

        TokenRequestContext tokenRequestContext = new TokenRequestContext()
        tokenRequestContext.addScopes(azureApiAccessScope)

        AccessToken azureToken = credentials.getTokenSync(tokenRequestContext)
        azureToken.getToken()
    }


    String getTokenFromCognitoIdentityPool(String userToken) {

        OidcProfile oidcProfile = tokenService.profileManager.getProfile(OidcProfile).orElse(null)
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

