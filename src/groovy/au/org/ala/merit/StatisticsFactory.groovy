package au.org.ala.merit

import au.org.ala.fieldcapture.CacheService
import au.org.ala.fieldcapture.SearchService
import au.org.ala.fieldcapture.SettingService
import grails.converters.JSON
import org.springframework.beans.factory.annotation.Autowired

class StatisticsFactory {

    private static final String DEFAULT_CONFIG = "/resources/statistics.json"
    private static final String STATISTICS_CONFIG_KEY = 'meritstatistics.config'
    private static final String CACHE_KEY_PREFIX = 'statistics.'

    Map config
    @Autowired
    ReportService reportService
    @Autowired
    CacheService cacheService
    @Autowired
    SettingService settingsService

    public StatisticsFactory() {}

    private void initialize() {
        String result = settingsService.get(STATISTICS_CONFIG_KEY)
        if (result) {
            config = JSON.parse(result)
        }
        if (!config) {
            config = readConfig()
        }
    }

    private Map readConfig() {
        def configAsString = getClass().getResource(DEFAULT_CONFIG).text
        JSON.parse(configAsString)
    }

    public synchronized void clearConfig() {
        config = null
        cacheService.clear(CACHE_KEY_PREFIX)
    }

    public synchronized List<Map> getStatisticsGroup(int groupNumber) {

        if (config == null) {
            initialize()
        }
        cacheService.get(CACHE_KEY_PREFIX + groupNumber, {
            this.config.groups[groupNumber].collect { statisticName ->
                Map statistic = config.statistics[statisticName]
                evaluateStatistic(statistic)
            }
        }, 1)
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
