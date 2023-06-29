package au.org.ala.merit.command

import au.org.ala.merit.ManagementUnitService
abstract class ManagementUnitReportCommand extends EditOrViewReportCommand {

    ManagementUnitService managementUnitService

    Map managementUnit

    String getEntityType() {
        'managementUnit'
    }

    Map getEntity() {
        if (!managementUnit) {
            managementUnit = managementUnitService.get(id)
        }
        managementUnit
    }

    String getHeaderTemplate() {
        '/managementUnit/managementUnitReportHeader'
    }

}
