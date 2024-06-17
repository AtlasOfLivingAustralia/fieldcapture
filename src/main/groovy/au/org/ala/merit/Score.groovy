package au.org.ala.merit

import groovy.util.logging.Slf4j

/** Represents a combination of an ecodata Score definition, and the results of evaluating that Score
 * in a particular context (usually a project or single report) as well as the project specific target for that score
 * if one has been defined
 */
@Slf4j
class Score {

    /** Project services/outputs that been delivered to 200% of the target are considered over delivered and produce a warning */
    private static final int OVER_DELIVERY_PERCENTAGE_THRESHOLD = 200

    /** If the score is tagged with "Survey" it is measuring something from a survey typed activity/service*/
    static String TAG_SURVEY = "Survey"

    /** If the score is tagged with "Survey" it is measuring something from a survey typed activity/service*/
    static String TAG_BASELINE = "Baseline"

    /** If the score is tagged with "Survey" it is measuring something from a survey typed activity/service*/
    static String TAG_INDICATOR = "Indicator"

    static String INVOICED_SCORE_DESCRIPTION = "Invoiced by"


    /** The id of the Score this target is based on */
    String scoreId
    String displayType
    String description
    String outputType
    String label
    String units
    String category
    boolean isOutputTarget

    int overDeliveryThreshold = OVER_DELIVERY_PERCENTAGE_THRESHOLD
    BigDecimal target
    Map result
    List<Map> periodTargets

    double singleResult() {
        this.result?.result ?: 0d
    }

    int getCount() {
        this.result?.count ?: 0
    }

    boolean hasTarget() {
        target && target.compareTo(BigDecimal.ZERO) != 0
    }

    /**
     * This supports the target being a String or number.
     */
    void setTarget(target) {
        if (target) {
            try {
                this.target = new BigDecimal(target)
            }
            catch (NumberFormatException e) {
                log.warn("Invalid target set: "+target)
            }
        }
        else {
            this.target = null
        }
    }

    /** Returns true if the amount delivered for this project output/service exceeds the target */
    boolean isOverDelivered() {
        boolean overDelivered = false
        if (target && singleResult()) {
            BigDecimal result = new BigDecimal(singleResult())

            overDelivered = target * overDeliveryThreshold / 100 <= result
        }
        overDelivered
    }

    List relatedScores

    Score getInvoicedScore() {
        relatedScores.find{it.description == INVOICED_SCORE_DESCRIPTION}?.score
    }
}
