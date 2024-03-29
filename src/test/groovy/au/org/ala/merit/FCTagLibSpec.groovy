package au.org.ala.merit

import grails.testing.web.taglib.TagLibUnitTest
import spock.lang.Specification

class FCTagLibSpec extends Specification implements TagLibUnitTest<FCTagLib> {

    void "siteFacet should output a label and facet value when the value is a String"() {
        setup:
        Map site = [extent:[geometry:[state:'ACT']]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="state" />', [site:site]) == "<span class='label label-success'>state</span> ACT"
    }

    void "siteFacet should output a label and comma separated facet value when the value is a List"() {
        setup:
        Map site = [extent:[geometry:[state:['ACT', 'NSW']]]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="state" />', [site:site]) == "<span class='label label-success'>state</span> ACT, NSW"
    }

    void "the max attribute of the siteFacet tag should limit the number of values rendered when the value is a List"() {
        setup:
        Map site = [extent:[geometry:[state:['ACT', 'NSW', 'Unused', 'Unused']]]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="state" max="2" />', [site:site]) == "<span class='label label-success'>state</span> ACT, NSW"
    }

    void "specifying a max attribute greater than the size of the siteFacet tag should limit the number of values rendered when the value is a List"() {
        setup:
        Map site = [extent:[geometry:[state:['ACT', 'NSW']]]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="state" max="10" />', [site:site]) == "<span class='label label-success'>state</span> ACT, NSW"
    }

    void "the label attribute of the siteFacet tag should optionally override the facet name"() {
        setup:
        Map site = [extent:[geometry:[state:['ACT', 'NSW', 'Unused', 'Unused']]]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="state" max="2" label="State"/>', [site:site]) == "<span class='label label-success'>State</span> ACT, NSW"
    }

    void "if there is no value for the facet nothing should be rendered"() {
        setup:
        Map site = [extent:[geometry:[state:['ACT', 'NSW', 'Unused', 'Unused']]]]

        expect:
        applyTemplate('<fc:siteFacet site="${site}" facet="nrm" max="2" label="State"/>', [site:site]) == ""
    }

}
