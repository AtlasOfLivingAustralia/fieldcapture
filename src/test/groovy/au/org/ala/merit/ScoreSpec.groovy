package au.org.ala.merit

import spock.lang.Specification

class ScoreSpec extends Specification {

    def "A Score should be considered over-delivered if the result is 200% or more of the target"() {

        when:
        Score score = new Score()
        score.target = 10
        score.result = [result:20]

        then:
        score.hasTarget()
        score.isOverDelivered()
    }
}
