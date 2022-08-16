package au.org.ala.merit

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.grails.plugin.cache.GrailsCacheManager
import groovy.json.JsonSlurper

import grails.core.GrailsApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.Cache
import org.springframework.scheduling.annotation.Scheduled

@Slf4j
class StatisticsFactory {

    private static final String STATISTICS_CACHE_REGION = 'homePageStatistics'
    private static final String DEFAULT_CONFIG = "/statistics.json"
    private static final String CONFIG_KEY = "config"

    @Autowired
    ReportService reportService
    @Autowired
    SettingService settingService
    @Autowired
    UserService userService

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
        List<Map> statistics = fromCache(groupNumber)
        if (!statistics) {
            log.info("Cache miss for homepage stats, key: ${groupNumber}")
            statistics = this.config.groups[groupNumber].collect { statisticName ->
                Map statistic = config.statistics[statisticName]
                evaluateStatistic(statistic)
            }
            cache(groupNumber, statistics)
        }
        statistics
    }

    private void cache(int groupNumber, List<Map> statistics) {
        String serializedStats = (statistics as JSON).toString(false)
        grailsCacheManager.getCache(STATISTICS_CACHE_REGION).put(Integer.toString(groupNumber), serializedStats)
    }

    private List<Map> fromCache(int groupNumber) {
        String value = grailsCacheManager.getCache(STATISTICS_CACHE_REGION).get(Integer.toString(groupNumber))?.get()
        List stats = null
        if (value) {
            stats = new JsonSlurper().parseText(value)
        }
        stats
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
        String systemEmail = grailsApplication.config.getProperty("fieldcapture.system.email.address")
        UserDetails user = new UserDetails("statisticsTask", systemEmail, "merit")
        userService.withUser(user) {
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
