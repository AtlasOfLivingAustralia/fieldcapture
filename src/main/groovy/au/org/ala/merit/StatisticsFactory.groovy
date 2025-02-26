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

    /** Lazily initialized in the getConfig method based on the HOME_PAGE_STATISTICS setting */
    private Map config

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
        config = null
    }

    private synchronized Map getConfig() {
        String configString = grailsCacheManager.getCache(STATISTICS_CACHE_REGION).get(CONFIG_KEY)?.get()
        // We check for the config string cache instead of whether this.config is null because
        // this allows the generic admin cache page to clear the cache and allow a config update
        // without having to know to call StatisticsFactory.clearConfig()
        // We can't cache the parsed config directly as it is not serializable.
        if (!configString || !this.config) { // Check both as the cache can survive a restart sometimes, but not the field.
            configString = initialize()
            grailsCacheManager.getCache(STATISTICS_CACHE_REGION).put(CONFIG_KEY, configString)
            JsonSlurper jsonSlurper = new JsonSlurper()
            this.config = Collections.synchronizedMap(jsonSlurper.parseText(configString))
        }

        this.config
    }

    public List<Map> getStatisticsGroupFromCache(int groupNumber) {
        fromCache(groupNumber)
    }

    public List<Map> getStatisticsGroup(int groupNumber) {

        Map config = getConfig()
        List groupConfig = config.groups[groupNumber]
        if (!groupConfig) {
            log.error("No configuration found for group number: ${groupNumber}")
            return null
        }

        List<Map> statistics
        // Only one thread should recalculate the statistics.  The config is a shared
        // synchronized instance so is safe to synchronize on.
        synchronized (groupConfig) {
            statistics = fromCache(groupNumber)
            if (!statistics) {
                log.info("Cache miss for homepage stats, key: ${groupNumber} - recalculating...")
                statistics = groupConfig.collect { statisticName ->
                    Map statistic = config.statistics[statisticName]
                    evaluateStatistic(statistic)
                }
                log.info("Caching homepage stats, key: ${groupNumber}")
                cache(groupNumber, statistics)
            }
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

    public Map randomGroup(int exclude = -1, boolean recacluateIfMissing = false) {
        int groupCount = getGroupCount()
        int group = Math.floor(Math.random()*groupCount)
        while (group == exclude) {
            group = Math.floor(Math.random()*groupCount)
        }
        List stats
        if (recacluateIfMissing) {
            stats = getStatisticsGroup(group)
        }
        else {
            stats = getStatisticsGroupFromCache(group)
        }

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
