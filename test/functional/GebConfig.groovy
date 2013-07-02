/*
	This is the Geb configuration file.

	See: http://www.gebish.org/manual/current/configuration.html
*/

import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.chrome.ChromeDriver

baseUrl = 'http://localhost:8090/fieldcapture/'
reportsDir = 'target/geb-reports'

// Use htmlunit as the default
// See: http://code.google.com/p/selenium/wiki/HtmlUnitDriver
driver = {
    def htmldriver = new HtmlUnitDriver()
    htmldriver.javascriptEnabled = true
    htmldriver
}

environments {

    // run as “grails -Dgeb.env=chrome test-app”
    // See: http://code.google.com/p/selenium/wiki/ChromeDriver
    chrome {
        System.setProperty('webdriver.chrome.driver', '/opt/webdrivers/chromedriver')
        driver = {
            new ChromeDriver()
        }
    }

    // run as “grails -Dgeb.env=firefox test-app”
    // See: http://code.google.com/p/selenium/wiki/FirefoxDriver
    firefox {
        driver = { new FirefoxDriver() }
    }

}