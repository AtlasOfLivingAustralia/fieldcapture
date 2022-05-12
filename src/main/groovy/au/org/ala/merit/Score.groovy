package au.org.ala.merit

/** Represents a combination of an ecodata Score definition, and the results of evaluating that Score
 * in a particular context (usually a project or single report) as well as the project specific target for that score
 * if one has been defined
 */
class Score {

    /** Project services/outputs that been delivered to 200% of the target are considered over delivered and produce a warning */
    private static final int OVER_DELIVERY_PERCENTAGE_THRESHOLD = 200

    /** The id of the Score this target is based on */
    String scoreId
    String displayType
    String description
    String outputType
    String label
    String units
    String category
    boolean isOutputTarget

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
            this.target = new BigDecimal(target)
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

            overDelivered = target * OVER_DELIVERY_PERCENTAGE_THRESHOLD / 100 <= result
        }
        overDelivered
    }
}
