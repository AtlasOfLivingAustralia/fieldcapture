/*
	This is the Geb configuration file.

	See: http://www.gebish.org/manual/current/configuration.html
*/


import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver

if (!System.getProperty("webdriver.chrome.driver")) {
    System.setProperty("webdriver.chrome.driver", "node_modules/chromedriver/bin/chromedriver")
}
driver = { new ChromeDriver() }
baseUrl = 'http://localhost:8087/'
atCheckWaiting = true
waiting {
    timeout = 20
    retryInterval = 0.5
}

environments {

    reportsDir = 'build/reports/geb-reports'

    // run as grails -Dgeb.env=chrome test-app
    chrome {

        driver = {
            ChromeOptions options = new ChromeOptions()
            options.addArguments("--remote-allow-origins=*")
            new ChromeDriver(options)
        }
    }

    firefox {
        driver = { new FirefoxDriver() }
    }

    chromeHeadless {

        if (!System.getProperty("webdriver.chrome.driver")) {
            System.setProperty("webdriver.chrome.driver", "node_modules/chromedriver/bin/chromedriver")
        }
        driver = {
            ChromeOptions o = new ChromeOptions()
            o.addArguments('headless')
            o.addArguments("window-size=1920,1080")
            o.addArguments('--disable-dev-shm-usage')
            o.addArguments("--remote-allow-origins=*")
            new ChromeDriver(o)
        }
    }

}
