package au.org.ala.merit.command

import au.org.ala.merit.MetadataService
import grails.validation.Validateable

class SaveInvestmentPriorityCommand implements Validateable {
    static final String UNIQUE_NAME_ERROR_CODE = 'unique'
    String investmentPriorityId
    String type
    String name
    String categories
    String managementUnits

    MetadataService metadataService

    static constraints = {
        investmentPriorityId nullable: true
        categories nullable:true
        managementUnits nullable: true

        name validator: { String name, SaveInvestmentPriorityCommand cmd ->
            cmd.validateName()
        }
    }

    String validateName() {
        if (!name) {
            // The mandatory check will handle this.
            return null
        }
        List<Map> resp = metadataService.findInvestmentPriorities([name:name])
        boolean valid = true
        if (resp) {
            valid = resp.every{it.investmentPriorityId == investmentPriorityId}
        }
        if (!valid) {
            return UNIQUE_NAME_ERROR_CODE
        }
    }

    Map save() {
        Map data = [
                investmentPriorityId:investmentPriorityId,
                type: type,
                name:name,
                categories: categories,
                managementUnits: managementUnits
        ]
        metadataService.saveInvestmentPriority(data)
    }

}
