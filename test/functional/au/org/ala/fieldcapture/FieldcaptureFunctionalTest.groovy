package au.org.ala.fieldcapture

import geb.Browser
import geb.Page
import geb.spock.GebReportingSpec
import org.apache.log4j.Logger
import org.openqa.selenium.StaleElementReferenceException
import pages.EntryPage
import pages.HomePage
import spock.lang.Shared

/**
 * Helper class for functional tests in fieldcapture.
 */
class FieldcaptureFunctionalTest extends GebReportingSpec {

    static Logger log = org.apache.log4j.Logger.getLogger(FieldcaptureFunctionalTest.class)

    @Shared def testConfig

    def setupSpec() {
        def filePath = new File('grails-app/conf/Config.groovy').toURI().toURL()
        def configSlurper = new ConfigSlurper(System.properties.get('grails.env'))
        testConfig = configSlurper.parse(filePath)
        def props = new Properties()
        if (testConfig.default_config) {
            def externalConfigFile = new File(testConfig.default_config)
            if (externalConfigFile.exists()) {
                externalConfigFile.withInputStream {
                    props.load(it)
                }
            }
            testConfig.merge(configSlurper.parse(props))
            if (System.getenv('PROJECT_EDITOR_USERNAME')) {
                testConfig.projectEditorUsername = System.getenv('PROJECT_EDITOR_USERNAME')
            }
            if (System.getenv('PROJECT_EDITOR_PASSWORD')) {
                testConfig.projectEditorPassword = System.getenv('PROJECT_EDITOR_PASSWORD')
            }
            if (System.getenv('PROJECT_ADMIN_USERNAME')) {
                testConfig.projectAdminUsername = System.getenv('PROJECT_ADMIN_USERNAME')
            }
            if (System.getenv('PROJECT_ADMIN_PASSWORD')) {
                testConfig.projectAdminPassword = System.getenv('PROJECT_ADMIN_PASSWORD')
            }
            if (System.getenv('ALA_ADMIN_USERNAME')) {
                testConfig.alaAdminUsername = System.getenv('ALA_ADMIN_USERNAME')
            }
            if (System.getenv('ALA_ADMIN_PASSWORD')) {
                testConfig.alaAdminPassword = System.getenv('ALA_ADMIN_PASSWORD')
            }
        }

        checkConfig()
    }

    def checkConfig() {

        if (!testConfig.projectEditorUsername) {
            log.warn("Missing test configuration: projectEditorUsername")
        }
        if (!testConfig.projectEditorPassword) {
            log.warn("Missing test configuration: projectEditorPassword")
        }
        if (!testConfig.projectAdminUsername) {
            log.warn("Missing test configuration: projectAdminUsername")
        }
        if (!testConfig.projectAdminPassword) {
            log.warn("Missing test configuration: projectAdminPassword")
        }
        if (!testConfig.alaAdminUsername) {
            log.warn("Missing test configuration: alaAdminUsername")
        }
        if (!testConfig.alaAdminPassword) {
            log.warn("Missing test configuration: alaAdminPassword")
        }
    }


    /**
     * This method will drop the ecodata-test database, then load the data stored in the
     * test/functional/resources/${dataSetName} directory.
     * It is intended to ensure the database is in a known state to facilitate functional testing.
     * If the loading script fails, an Exception will be thrown.
     *
     * N.B. Running the script requires the current working directory to be the root of the fieldcapture-hub project.
     * (Which should be the case unless the tests are being run via an IDE)
     *
     * @param dataSetName identifies the data set to load.
     *
     */
    void useDataSet(String dataSetName) {

        def dataSetPath = getClass().getResource("/resources/"+dataSetName+"/").getPath()

        log.info("Using dataset from: ${dataSetPath}")
        def userName = System.getProperty('grails.mongo.username') ?: ""
        def password = System.getProperty('grails.mongo.password') ?: ""
        int exitCode = "./scripts/loadFunctionalTestData.sh ${dataSetPath} ${userName} ${password}".execute().waitFor()
        if (exitCode != 0) {
            throw new RuntimeException("Loading data set ${dataSetPath} failed.  Exit code: ${exitCode}")
        }
    }

    def logout(Browser browser) {
        def logoutButton = browser.page.$('.login-logout a.btn-login')
        if (logoutButton.displayed && logoutButton.text() == "Logout") {
            try {
                logoutButton.click();
                waitFor 25, { at HomePage }
            }
            catch (Exception e) {
                log.warn("Test ended during page reload or with a modal backdrop resulting in failure to click logout button - directly navigating browser")
                logoutViaUrl(browser)
            }
        }
        else {
            logoutViaUrl(browser)
        }

    }

    def logoutViaUrl(browser) {
        String serverUrl = (testConfig.baseUrl instanceof String) ? testConfig.baseUrl : testConfig.grails.serverURL
        String logoutUrl = "${serverUrl}/logout/logout?appUrl=${serverUrl}"
        browser.go logoutUrl
    }

}
