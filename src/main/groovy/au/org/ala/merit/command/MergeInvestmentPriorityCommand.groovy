package au.org.ala.merit.command

import au.org.ala.merit.MetadataService
import grails.validation.Validateable

class MergeInvestmentPriorityCommand implements Validateable {

    String investmentPriorityIdToDelete
    String investmentPriorityIdToReplaceWith

    MetadataService metadataService

    static constraints = {
    }

    Map merge() {
        metadataService.mergeInvestmentPriorities(investmentPriorityIdToDelete, investmentPriorityIdToReplaceWith)
    }

}
