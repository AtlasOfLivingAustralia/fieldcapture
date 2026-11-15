package au.org.ala.merit

import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

class CommonServiceSpec extends Specification implements ServiceUnitTest<CommonService> {

    WebService webService = Mock(WebService)

    def setup() {
        service.webService = webService
    }

    def "buildUrlParamsFromMap builds query string from map values"() {
        expect:
        service.buildUrlParamsFromMap([:]) == ''
        service.buildUrlParamsFromMap([key: 'value']) == '?key=value'
        service.buildUrlParamsFromMap([key1: 'value1', key2: 'value2']) == '?key1=value1&key2=value2'
    }

    def "returns false for URL without scheme"() {
        given:
        webService.isValidDomain('attacker.invalid') >> false

        expect:
        !service.isRedirectSafe('//attacker.invalid/path')
    }

    def "returns false for scheme other than http or https"() {
        given:
        webService.isValidDomain('allowed.example') >> true

        expect:
        !service.isRedirectSafe('ftp://allowed.example/path')
    }

    def "returns false for Javascript URL in allowed list"() {
        given:
        webService.isValidDomain('allowed.example') >> true

        expect:
        !service.isRedirectSafe('javascript://allowed.example/%0Aalert(1)')
    }

    def "returns true for absolute redirect URL when domain is valid"() {
        given:
        webService.isValidDomain('example.org') >> true

        expect:
        service.isRedirectSafe('https://example.org/path')
    }

    def "returns false for absolute redirect URL when domain is not valid"() {
        given:
        webService.isValidDomain('malicious.example') >> false

        expect:
        !service.isRedirectSafe('https://malicious.example/path')
    }

    def "returns false for malformed redirect URL"() {
        expect:
        !service.isRedirectSafe('http://[invalid')
    }

    def "returns false for null redirect URL"() {
        expect:
        !service.isRedirectSafe(null)
    }

    def "returns false for blank redirect URL"() {
        expect:
        !service.isRedirectSafe('')
    }
}

