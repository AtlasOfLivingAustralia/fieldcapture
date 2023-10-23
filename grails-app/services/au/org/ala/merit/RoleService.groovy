package au.org.ala.merit

import groovy.util.logging.Slf4j
import org.grails.web.json.JSONObject

@Slf4j
class RoleService {
    def metadataService, cacheService

    /**
     * This role is given to grant and project managers and allows access to workflow actions
     * (approving reports and MERIT plans) for the project the role is granted on.
     * It can only be given to a user that also has the HUB_OFFICER_ROLE
     */
    public static final String GRANT_MANAGER_ROLE = 'caseManager'

    /**
     * This role allows a user to administer a project, in addition to the PROJECT_EDITOR_ROLE, it also allows
     * access to the MERI plan, the ability to submit reports and assign other users the PROJECT_ADMIN and
     * PROJECT_EDITOR role.
     * It cannot be assigned to a user that also has the HUB_OFFICER_ROLE, they should be given the GRANT_MANAGER_ROLE instead.
     */
    public static final String PROJECT_ADMIN_ROLE = 'admin'

    /**
     * This role allows a user to view non-public data for a project, as well as complete reports, upload sites and
     * data set summaries.
     */
    public static final String PROJECT_EDITOR_ROLE = 'editor'
    public static final String PROJECT_FC_READ_ONLY_ROLE = 'ROLE_FC_READ_ONLY'
    public static final String PROJECT_FC_OFFICER_ROLE = 'ROLE_FC_OFFICER'
    public static final String PROJECT_FC_ADMIN_ROLE = 'ROLE_FC_ADMIN'
    public static final String PROJECT_SURVEYOR_ROLE = 'projectParticipant'

    /**
     * A check against this role will pass if the user has any hub or any Project role.  This is more of a permission
     * than a role as it's currently not directly assigned to a user.
     */
    public static final String PROJECT_READ_ONLY_ROLE = 'readOnly'

    /**
     * This role allows a user to perform administration actions in MERIT, such as modifying the home page
     */
    public static final String HUB_ADMIN_ROLE = 'siteAdmin'

    /**
     * This role is granted to project and grant managers.  It allows them to view and edit project data and
     * assign themselves the GRANT_MANAGER role for a project.
     */
    public static final String HUB_OFFICER_ROLE = 'officer'

    /**
     * This role allows a user to view non-public data for projects as download MERIT data.  It is normally
     * granted to researchers or auditors.
     */
    public static final String HUB_READ_ONLY_ROLE = 'siteReadOnly'

    /** MERIT only uses a subset of the roles that ecodata supports */
    private static final List MERIT_PROJECT_ROLES = [GRANT_MANAGER_ROLE, PROJECT_ADMIN_ROLE, PROJECT_EDITOR_ROLE, PROJECT_READ_ONLY_ROLE]
    public static final List MERIT_HUB_ROLES = [HUB_ADMIN_ROLE, HUB_OFFICER_ROLE, HUB_READ_ONLY_ROLE]

    /** Granted to ALA developers, gives access to all functions in MERIT */
    public static final String ALA_ADMIN_ROLE = "alaAdmin"

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

    List getAugmentedRoles() {
        List rolesCopy = new ArrayList(MERIT_PROJECT_ROLES)
        rolesCopy.add(ALA_ADMIN_ROLE)
        rolesCopy.addAll(MERIT_HUB_ROLES)

        return rolesCopy
    }

    Set getAllowedGrantManagerRoles() {
        return new HashSet([GRANT_MANAGER_ROLE])
    }

    Set getAllowedUserRoles() {
        return new HashSet([PROJECT_ADMIN_ROLE, PROJECT_EDITOR_ROLE, PROJECT_SURVEYOR_ROLE])
    }

    public Set getHubRoles() {
        return new HashSet([PROJECT_FC_READ_ONLY_ROLE, PROJECT_FC_OFFICER_ROLE, PROJECT_FC_ADMIN_ROLE])
    }

}
