package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
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
        String url = bdrBaseUrl+'/'+dataSetId+'/items'

        String token = bdrTokenService.getAuthToken(false)

        String userToken = tokenService.getAuthToken(true)
        String cognitoToken = getTokenFromCognitoIdentityPool(userToken)
        azureTest(cognitoToken)
        log.info("Downloading data set from BDR: $url")

        webService.proxyGetRequest(response, url, false)
    }

    private void azureTest(String token) {
        String azureTenantId = grailsApplication.config.getProperty('bdr.azure.tenantId')
        String azureClientId = grailsApplication.config.getProperty('bdr.azure.clientId')

        ClientAssertionCredential credentials = new ClientAssertionCredentialBuilder()
                .tenantId(azureTenantId)
                .clientId(azureClientId)
                .clientAssertion { token }
                .build()

        String blobEndpoint = grailsApplication.config.getProperty('bdr.azure.blobEndpoint')
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .credential(credentials)
                .endpoint(blobEndpoint)
                .buildClient()

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient("csvcontainer")
        println containerClient.listBlobs().forEach { blobItem ->
            println blobItem.getName()
        }
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

