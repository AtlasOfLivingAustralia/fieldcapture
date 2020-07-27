package au.org.ala.merit

import grails.plugin.cache.GrailsCacheManager
import groovy.json.JsonSlurper
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.Cache
import org.springframework.scheduling.annotation.Scheduled

import static au.org.ala.merit.ScheduledJobContext.withUser


class StatisticsFactory {

    private Logger log = Logger.getLogger(StatisticsFactory.class)

    private static final String STATISTICS_CACHE_REGION = 'homePageStatistics'
    private static final String DEFAULT_CONFIG = "/resources/statistics.json"
    private static final String CONFIG_KEY = "config"

    @Autowired
    ReportService reportService
    @Autowired
    SettingService settingService
    @Autowired
    GrailsCacheManager grailsCacheManager
    @Autowired
    GrailsApplication grailsApplication

    public StatisticsFactory() {}

    private String initialize() {
        String configString = settingService.getSettingText(SettingPageType.HOME_PAGE_STATISTICS)
        if (!configString) {
            configString = readConfig()
        }
        configString
    }

    private String readConfig() {
        getClass().getResource(DEFAULT_CONFIG).text
    }

    public synchronized void clearConfig() {
        Cache cache = grailsCacheManager.getCache(STATISTICS_CACHE_REGION)
        cache.clear()
    }

    private synchronized Map getConfig() {
        String config = grailsCacheManager.getCache(STATISTICS_CACHE_REGION).get(CONFIG_KEY)?.get()
        if (!config) {
            config = initialize()
            grailsCacheManager.getCache(STATISTICS_CACHE_REGION).put(CONFIG_KEY, config)
        }
        JsonSlurper jsonSlurper = new JsonSlurper()
        jsonSlurper.parseText(config)
    }

    public synchronized List<Map> getStatisticsGroup(int groupNumber) {

        Map config = getConfig()
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
        Map config = getConfig()
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

    // Refresh the statistics every day after midnight
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
