package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import com.azure.core.credential.AccessToken
import com.azure.core.credential.TokenRequestContext
import com.azure.core.implementation.AccessTokenCache
import com.azure.identity.ClientAssertionCredentialBuilder
import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClient
import com.azure.storage.blob.BlobServiceClientBuilder
import com.nimbusds.jwt.JWT
import grails.converters.JSON
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import com.azure.identity.ClientAssertionCredential
import net.sf.json.JSONArray
import org.pac4j.oidc.profile.OidcProfile
import software.amazon.awssdk.services.cognitoidentity.CognitoIdentityClient
import software.amazon.awssdk.services.cognitoidentity.model.GetIdRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetIdResponse
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenRequest
import software.amazon.awssdk.services.cognitoidentity.model.GetOpenIdTokenResponse

import javax.annotation.PostConstruct
import javax.persistence.Access
import javax.servlet.http.HttpServletResponse

/**
 * Interface to the BDR system - used to retrieve data submitted for MERIT projects via the Monitor application.
 */
@Slf4j
class BdrService {

    GrailsApplication grailsApplication
    WebService webService
    TokenService tokenService
    CommonService commonService
    TokenService bdrTokenService

    AccessTokenCache accessTokenCache

    void downloadDataSet(String projectId, String dataSetId, String format, HttpServletResponse response) {
        String azureToken = getAzureAccessToken()

        String bdrBaseUrl = grailsApplication.config.getProperty('bdr.api.url')
        format = URLEncoder.encode(format, 'UTF-8')
        String url = bdrBaseUrl+'/cql?_mediatype='+format
        String query = (dataSetQuery(dataSetId) as JSON).toString()
        String encodedQuery = URLEncoder.encode(query, "UTF-8")

        url+="&filter="+encodedQuery

        log.info("Downloading data set from BDR: $url")

        webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, null, azureToken)
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
                .clientAssertion {  bdrTokenService.getAuthToken(false)?.getValue() }
                .build()

        accessTokenCache = new AccessTokenCache(credentials)

    }

    private String getAzureAccessToken() {
        // Scope to request when authenticating with Azure
        String azureApiAccessScope = grailsApplication.config.getProperty('bdr.azure.apiScope')

        TokenRequestContext tokenRequestContext = new TokenRequestContext()
        tokenRequestContext.addScopes(azureApiAccessScope)

        AccessToken accessToken = accessTokenCache.getTokenSync(tokenRequestContext, false)
        accessToken.getToken()
    }

    private Map dataSetQuery(String dataSetId) {
        Map query = [
                "op": "and",
                "args": [
                        ["op":"=","args":[["property":"nrm-submission"], dataSetId]],
                        ["op":"=","args":[["property":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"],"http://www.opengis.net/ont/geosparql#Feature"]]
                ]
        ]
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

