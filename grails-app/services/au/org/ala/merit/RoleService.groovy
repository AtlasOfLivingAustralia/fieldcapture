package au.org.ala.merit

import groovy.util.logging.Slf4j
import org.grails.web.json.JSONObject

@Slf4j
class RoleService {
    def metadataService, cacheService

    public static final String GRANT_MANAGER_ROLE = 'caseManager'
    public static final String PROJECT_ADMIN_ROLE = 'admin'
    public static final String PROJECT_EDITOR_ROLE = 'editor'
    public static final String PROJECT_FC_READ_ONLY_ROLE = 'ROLE_FC_READ_ONLY'
    public static final String PROJECT_FC_OFFICER_ROLE = 'ROLE_FC_OFFICER'
    public static final String PROJECT_FC_ADMIN_ROLE = 'ROLE_FC_ADMIN'


    /** MERIT only uses a subset of the roles that ecodata supports */
    private static final List MERIT_PROJECT_ROLES = [GRANT_MANAGER_ROLE, PROJECT_ADMIN_ROLE, PROJECT_EDITOR_ROLE]

    private List roles(Boolean clearCache = false) {
        if (clearCache) {
            log.info "Clearing cache for 'accessLevels'"
            cacheService.clear('accessLevels') // clear cache
        }

        def roles = metadataService.getAccessLevels().collect {
            if (it && it instanceof JSONObject && it.has('name') && it.name) {
                it.name
            } else {
                log.warn "Error getting accessLevels: ${it}"
            }
        }.findAll{
            it in MERIT_PROJECT_ROLES
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
        rolesCopy.addAll(["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]) // augment roles with these extra ones TODO: refactor this

        return rolesCopy
    }

    public Set getAllowedGrantManagerRoles() {
        return new HashSet([GRANT_MANAGER_ROLE])
    }

    public Set getAllowedUserRoles() {
        return new HashSet([PROJECT_ADMIN_ROLE, PROJECT_EDITOR_ROLE, PROJECT_FC_READ_ONLY_ROLE, PROJECT_FC_OFFICER_ROLE, PROJECT_FC_ADMIN_ROLE])
    }

    public Set getHubRoles() {
        //todo: refactor this to call a webservice
        def roles = [ PROJECT_FC_READ_ONLY_ROLE, PROJECT_FC_OFFICER_ROLE, PROJECT_FC_ADMIN_ROLE]
        return roles
    }
}
