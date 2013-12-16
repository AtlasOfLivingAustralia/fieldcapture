package au.org.ala.fieldcapture

import org.codehaus.groovy.grails.web.json.JSONObject

class RoleService {
    def metadataService, cacheService

    private List roles(Boolean clearCache = false) {
        if (clearCache) {
            log.info "Clearing cache for 'accessLevels'"
            cacheService.clear('accessLevels') // clear cache
        }

        def roles = metadataService.getAccessLevels().collect {
            if (it && it instanceof JSONObject && it.has('name')) {
                it.name
            } else {
                log.warn "Error getting accessLevels: ${it}"
            }
        }

        return roles?:[]
    }

    public List getRoles() {
        def roles = roles() // cached

        if (roles.size() <= 1) {
            // possible empty list or value, due to previous WS call timing out
            roles = roles(true) // reload with cleared cache
        }

        return roles
    }

    public List getAugmentedRoles() {
        def rolesCopy = getRoles().clone()
        rolesCopy.addAll(["alaAdmin","siteAdmin"]) // augment roles with these extra ones TODO: refactor this

        return rolesCopy
    }
}
