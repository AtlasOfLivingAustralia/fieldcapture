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
        def allRoles = roles() // cached

        if (allRoles.size() <= 1) {
            // possible empty list or value, due to previous WS call timing out
            allRoles = roles(true) // reload with cleared cache
        }

        return allRoles
    }

    public List getAugmentedRoles() {
        def rolesCopy = getRoles().clone()
        rolesCopy.addAll(["alaAdmin","siteAdmin","officer"]) // augment roles with these extra ones TODO: refactor this

        return rolesCopy
    }
}
