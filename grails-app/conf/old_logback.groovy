import ch.qos.logback.classic.Level
import grails.util.BuildSettings
import grails.util.Environment
import org.springframework.boot.logging.logback.ColorConverter
import org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter

import java.nio.charset.Charset

conversionRule 'clr', ColorConverter
conversionRule 'wex', WhitespaceThrowableProxyConverter

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        charset = Charset.forName('UTF-8')

        pattern =
                '%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} ' + // Date
                        '%clr(%5p) ' + // Log level
                        '%clr(---){faint} %clr([%15.15t]){faint} ' + // Thread
                        '%clr(%-40.40logger{39}){cyan} %clr(:){faint} ' + // Logger
                        '%m%n%wex' // Message
    }
}

//def targetDir = (System.getProperty('fieldcapture.logs') ?: '. /logs')
//if (Environment.isDevelopmentMode() && targetDir != null) {
//    appender("FULL_STACKTRACE", FileAppender) {
//        file = "${targetDir}/stacktrace.log"
//        append = true
//        encoder(PatternLayoutEncoder) {
//            pattern = "%level %logger - %msg%n"
//        }
//    }
//    logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)
//}

logger("au.org.ala.fieldcapture",INFO, ['STDOUT'],false)
logger("au.org.ala.merit",INFO, ['STDOUT'],false)
logger("asset.pipeline.jsass", ERROR, ['STDOUT'], false)
logger("asset.pipeline", ERROR, ['STDOUT'], false)
root(ERROR, ['STDOUT'])

//final error = [
//
//]
//
//for (def name : error) logger(name, ERROR)
