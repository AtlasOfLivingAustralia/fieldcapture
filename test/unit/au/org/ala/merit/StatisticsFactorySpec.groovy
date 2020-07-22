package au.org.ala.merit


import grails.plugin.cache.GrailsCacheManager
import grails.plugin.cache.GrailsConcurrentMapCache
import spock.lang.Specification

class StatisticsFactorySpec extends Specification {

    StatisticsFactory factory = new StatisticsFactory()
    GrailsCacheManager grailsCacheManager = Mock(GrailsCacheManager)
    SettingService settingService = Mock(SettingService)
    ReportService reportService = Mock(ReportService)

    def setup() {
        Map caches = [:].withDefault { key -> new GrailsConcurrentMapCache(key) }
        grailsCacheManager.getCache(_) >> { String name -> caches.get(name) }
        factory.grailsCacheManager = grailsCacheManager
        factory.settingService = settingService
        factory.reportService = reportService
    }

    def "The statistics config will be cleared when the cache is cleared"(){

        setup:
        Map statsConfig = [groups:[["stat1"]], statistics:[stat1:[scoreLabel:"Test", type:"score", label:"Test"]]]

        when:
        List<Map> stats = factory.getStatisticsGroup(0)

        then:
        1 * settingService.getJson(_) >> statsConfig
        1 * reportService.getNumericScore("Test", _) >> 3
        stats.size() == 1
        stats[0].label == "Test"
        stats[0].value == "3"

        when: "We re-request the statistics"
        factory.getStatisticsGroup(0)

        then: "The cache will be used"
        0 * settingService.getJson(_)
        0 * reportService._

        when: "We clear the cache and re-request the statistics"
        grailsCacheManager.getCache(StatisticsFactory.STATISTICS_CACHE_REGION).clear()
        factory.getStatisticsGroup(0)

        then: "Both the settings and the data will be refreshed"
        1 * settingService.getJson(_) >> statsConfig
        1 * reportService.getNumericScore("Test", _) >> 3

    }
}
