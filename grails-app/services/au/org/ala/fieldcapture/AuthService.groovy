package au.org.ala.fieldcapture

import org.springframework.web.context.request.RequestContextHolder

class AuthService {
    //static transactional = false
    def webService, grailsApplication
    //def userListMap = [:]

    def username() {
        return (RequestContextHolder.currentRequestAttributes()?.getUserPrincipal()?.attributes?.email)?:null
    }

    def displayName() {
        if(RequestContextHolder.currentRequestAttributes()?.getUserPrincipal()?.attributes?.firstname){
            ((RequestContextHolder.currentRequestAttributes()?.getUserPrincipal()?.attributes?.firstname) +
                    " " + (RequestContextHolder.currentRequestAttributes()?.getUserPrincipal()?.attributes?.lastname))
        } else {
            null
        }
    }

    protected boolean userInRole(role) {
        return grailsApplication.config.security.cas.bypass ||
                RequestContextHolder.currentRequestAttributes()?.isUserInRole(role) // || isAdmin()
    }

    def userDetails() {
        def attr = RequestContextHolder.currentRequestAttributes()?.getUserPrincipal()?.attributes
        [
                userId:attr?.userid?.toString(),
                email: attr?.email?.toString()?.toLowerCase(),
                userDisplayName: (attr?.firstname?:"" + " " +attr?.lastname?:"").trim()
        ]
    }

//    @Cacheable("userListCache")
//    def getUserNamesForIdsMap(Boolean ignoredArg) {
//        //def userListMap = [:]
//        try {
//            def userListJson = webService.doJsonPost(grailsApplication.config.userDetails.url, grailsApplication.config.userDetails.path, "", "")
//            log.debug "lookup"
//            if (userListJson instanceof net.sf.json.JSONObject) {
//                userListJson.keySet().each { id ->
//                    userListMap.put(id, userListJson[id]);
//                }
//            } else {
//                log.info "error -  " + userListJson.getClass() + ":"+ userListJson
//            }
//        } catch (Exception e) {
//            log.error "Cache refresh error" + e.message
//        }
//        return userListMap
//    }

}
