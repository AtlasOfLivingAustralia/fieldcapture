package au.org.ala.merit

import au.org.ala.fieldcapture.SettingService
import net.sf.ehcache.CacheException
import net.sf.ehcache.Ehcache
import net.sf.ehcache.Element
import net.sf.ehcache.event.CacheEventListener
import org.apache.log4j.Logger
import org.springframework.cache.Cache

import static au.org.ala.merit.ScheduledJobContext.*
import grails.converters.JSON
import grails.plugin.cache.GrailsCacheManager
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled


class StatisticsFactory {

    private Logger log = Logger.getLogger(StatisticsFactory.class)

    private static final String STATISTICS_CACHE_REGION = 'homePageStatistics'
    private static final String DEFAULT_CONFIG = "/resources/statistics.json"
    private static final String STATISTICS_CONFIG_KEY = 'meritstatistics.config'

    Map config
    @Autowired
    ReportService reportService
    @Autowired
    SettingService settingService
    @Autowired
    GrailsCacheManager grailsCacheManager
    @Autowired
    GrailsApplication grailsApplication

    public StatisticsFactory() {}

    private void initialize() {
        String result = settingService.get(STATISTICS_CONFIG_KEY)
        if (result) {
            config = JSON.parse(result)
        }
        if (!config) {
            config = readConfig()
        }
        Ehcache ehcache = grailsCacheManager.getCache(STATISTICS_CACHE_REGION).getNativeCache()
        ehcache.getCacheEventNotificationService().registerListener(new CacheEventListener() {
            @Override
            void notifyElementRemoved(Ehcache cache, Element element) throws CacheException {
                log.debug("${cache.name}: Removed: ${element.objectKey}")
            }

            @Override
            void notifyElementPut(Ehcache cache, Element element) throws CacheException {
                log.debug("${cache.name}: Put: ${element.objectKey}")
            }

            @Override
            void notifyElementUpdated(Ehcache cache, Element element) throws CacheException {
                log.debug("${cache.name}: Updated: ${element.objectKey}")
            }

            @Override
            void notifyElementExpired(Ehcache cache, Element element) {
                log.debug("${cache.name}: Expired: ${element.objectKey}")
            }

            @Override
            void notifyElementEvicted(Ehcache cache, Element element) {
                log.debug("${cache.name}: Evicted: ${element.objectKey}")
            }

            @Override
            void notifyRemoveAll(Ehcache cache) {
                log.debug("${cache.name}: Removed all: ${cache.name}")
            }

            @Override
            void dispose() {
                log.debug("Dispose")
            }
        })
    }

    private Map readConfig() {
        def configAsString = getClass().getResource(DEFAULT_CONFIG).text
        JSON.parse(configAsString)
    }

    public synchronized void clearConfig() {
        config = null
        Cache cache = grailsCacheManager.getCache(STATISTICS_CACHE_REGION)
        cache.clear()
    }

    public synchronized List<Map> getStatisticsGroup(int groupNumber) {

        if (config == null) {
            initialize()
        }

        List<Map> statistics = grailsCacheManager.getCache(STATISTICS_CACHE_REGION).get(groupNumber)?.get()
        if (!statistics) {
            log.info("Cache miss for homepage stats, key: ${groupNumber}")
            statistics = this.config.groups[groupNumber].collect { statisticName ->
                Map statistic = config.statistics[statisticName]
                evaluateStatistic(statistic)
            }
            grailsCacheManager.getCache(STATISTICS_CACHE_REGION).put(groupNumber, statistics)
        }
        statistics
    }

    public Map randomGroup(int exclude = -1) {
        int groupCount = getGroupCount()
        int group = Math.floor(Math.random()*groupCount)
        while (group == exclude) {
            group = Math.floor(Math.random()*groupCount)
        }
        List stats = getStatisticsGroup(group)

        [group:group, statistics:stats]
    }

    public synchronized int getGroupCount() {
        if (config == null) {
            initialize()
        }
        return config.groups.size()
    }

    Map evaluateStatistic(Map config) {

        def displayProps =
                [config:config.config, title:config.title, label:config.label, units:config.units]

        def typeConfig = config.minus(displayProps)

        Statistic statistic = create(typeConfig.remove('type'), typeConfig)

        try {
            displayProps.value = statistic.statistic
        }
        catch (Exception e) {
            e.printStackTrace()
            displayProps.value = 0
        }

        displayProps
    }

    // Refresh the statistics every day at midnight
    @Scheduled(cron="0 3 0 * * *")
    public void reloadStatistics() {
        withUser([name:"statisticsTask"]) {
            settingService.withDefaultHub {

                log.info("Reloading homepage statistics...")

                clearConfig()

                for (int i=0; i<getGroupCount(); i++) {
                    getStatisticsGroup(i)
                }
            }
        }
    }

    private Statistic create(String type, Map properties) {
        Statistic statistic
        switch(type) {
            case "score":
                statistic = new FilteredScore(properties)
                break
            case "outputTarget":
                statistic = new OutputTarget(properties)
                break
            case "projectCount":
                statistic = new FilteredProjectCount(properties)
                break
            case "investmentDollars":
                statistic = new InvestmentDollars(properties)
                break
            case "investmentProjectCount":
                statistic = new InvestmentProjectCount(properties)
                break
            default:
                throw new IllegalArgumentException("Unsupported statistic type: ${type}")
        }
        statistic.reportService = reportService
        statistic

    }
}
