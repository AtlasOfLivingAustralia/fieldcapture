package au.org.ala.merit.reports

import au.org.ala.ecodata.forms.ActivityFormService
import au.org.ala.merit.MetadataService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
/**
 * Responsible for obtaining report specific data to render into a report template.
 * Report config beans are looked up in the applicationContext by name based on the report type and the
 * program configuration.
 */
@Slf4j
class ReportLifecycleListener {
    boolean deleteSiteOnReset = true
    @Autowired
    ActivityFormService activityFormService
    @Autowired
    MetadataService metadataService

    Map getContextData(Map context, Map report, Map activity) { [:] }
    Map getOutputData(Map context, Map outputConfig, Map report) { [:] }
    Map reportSaved(Map report, Map activityData) { [:] }
    Map reportSubmitted(Map report, List reportActivityIds, Map reportOwner) { [:] }
    Map reportApproved(Map report, List reportActivityIds, Map reportOwner) { [:] }
    Map reportRejected(Map report, List reportActivityIds, Map reportOwner) { [:] }
    Map reportCancelled(Map report, List reportActivityIds, Map reportOwner) { [:] }
    Map reportUnCancelled(Map report, List reportActivityIds, Map reportOwner) { [:] }
    Map reportReset(Map report) { [:] }

    private List<Map> findReferencedEntityTypes(String activityFormType) {
        List<Map> referencedEntities = []
        Map activityForm = activityFormService.findActivityForm(activityFormType)
        activityForm.sections.each { Map formSection ->
            OutputMetadata outputMetadata = new OutputMetadata(formSection.template)

            outputMetadata.dataModelIterator { String path, Map node ->
                if (node.dataType == 'text' && node.entityType) {
                    referencedEntities << [outputName: formSection.name, path: path, node: node]
                }
            }
        }
        referencedEntities
    }

    List<Map> findReferencedEntities(Map activityData) {
        List<Map> typesInForm = findReferencedEntityTypes(activityData.type)
        List<Map> entityIds = []
        activityData.outputs?.each { Map output ->
            List<Map> typesInOutput = typesInForm.findAll{it.outputName == output.name}
            typesInOutput.each { Map entityType ->
                List value = getValueFromPath(entityType.path, output.data)?.findAll()
                if (value) {
                    entityIds << [entityType: entityType.node.entityType, entityIds: value]
                }
            }
        }
        entityIds

    }

    /**
     * Traverses the '.' separated path through the supplied Map and returns the value at the end of the path.
     * If the path contains a list, the value of the path is returned for each item in the list.
     * If the path contains a list of lists, the value of the path is returned for each item in each list.
     * @param path the path to traverse
     * @param data the data to traverse
     * @return the value at the end of the path, or null if the path doesn't exist.
     */
    static List getValueFromPath(String path, Map data) {
        if (!path) {
            return null
        }
        List result = []
        String[] pathElements = path.split('\\.')
        int i = 0
        Object current = data
        while (i < pathElements.length - 1) {
            current = current[pathElements[i]]
            if (!current) {
                return result
            }
            else if (current instanceof List) {
                current.each {
                    result.addAll(getValueFromPath(pathElements[i+1..-1].join('.'), it))
                }
                return result
            }
            else if (!(current instanceof Map)) {
                return result
            }
            i++
        }
        result << current[pathElements[i]]
        result
    }

    Map getTargetsForReportPeriod(Map report, List<Map> outputTargets) {
        String endDate = report.toDate

        outputTargets?.collectEntries { Map outputTarget ->
            String scoreId = outputTarget.scoreId
            String name = scoreName(scoreId) ?: scoreId
            String previousPeriod = ''
            Map matchingPeriodTarget = outputTarget?.periodTargets?.find { Map periodTarget ->
                boolean result = previousPeriod < endDate && periodTarget.period >= endDate
                previousPeriod = periodTarget.period
                result
            }
            [(name): matchingPeriodTarget?.target]
        }
    }

    String scoreName(String scoreId) {
        List scores = metadataService.getScores(false)
        scores.find { it.scoreId == scoreId }?.name
    }


}
