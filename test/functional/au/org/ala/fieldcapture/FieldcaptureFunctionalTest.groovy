package au.org.ala.fieldcapture

import geb.Browser
import geb.spock.GebReportingSpec
import pages.EntryPage
import spock.lang.Shared

/**
 * Helper class for functional tests in fieldcapture.
 */
class FieldcaptureFunctionalTest extends GebReportingSpec {

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
            throw new IllegalArgumentException("Missing test configuration: projectEditorUsername")
        }
        if (!testConfig.projectEditorPassword) {
            throw new IllegalArgumentException("Missing test configuration: projectEditorPassword")
        }
        if (!testConfig.projectAdminUsername) {
            throw new IllegalArgumentException("Missing test configuration: projectAdminUsername")
        }
        if (!testConfig.projectAdminPassword) {
            throw new IllegalArgumentException("Missing test configuration: projectAdminPassword")
        }
        if (!testConfig.alaAdminUsername) {
            throw new IllegalArgumentException("Missing test configuration: alaAdminUsername")
        }
        if (!testConfig.alaAdminPassword) {
            throw new IllegalArgumentException("Missing test configuration: alaAdminPassword")
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

        int exitCode = "scripts/loadFunctionalTestData.sh ${dataSetPath}".execute().waitFor()
        if (exitCode != 0) {
            throw new RuntimeException("Loading data set ${dataSetPath} failed.  Exit code: ${exitCode}")
        }
    }

    def logout(Browser browser) {
        browser.go "${getConfig().baseUrl}logout/logout?casUrl=https://auth.ala.org.au/cas/logout&appUrl=${getConfig().baseUrl+ EntryPage.url}"
    }

}
