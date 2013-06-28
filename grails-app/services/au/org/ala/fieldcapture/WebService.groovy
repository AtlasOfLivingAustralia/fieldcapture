package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException

class WebService {

    def grailsApplication

    def get(String url) {
        def conn = new URL(url).openConnection()
        try {
            conn.setConnectTimeout(10000)
            conn.setReadTimeout(50000)
            return conn.content.text
        } catch (SocketTimeoutException e) {
            def error = [error: "Timed out calling web service. URL= ${url}."]
            log.error error
            return error
        } catch (Exception e) {
            def error = [error: "Failed calling web service. ${e.getClass()} ${e.getMessage()} URL= ${url}.",
                         detail: conn.errorStream.text]
            log.error error
            return error
        }
    }

    def getJson(String url) {
        def conn = new URL(url).openConnection()
        try {
            conn.setConnectTimeout(10000)
            conn.setReadTimeout(50000)
            def json = conn.content.text
            return JSON.parse(json)
        } catch (ConverterException e) {
            def error = ['error': "Failed to parse json. ${e.getClass()} ${e.getMessage()} URL= ${url}."]
            log.error error
            return error
        } catch (SocketTimeoutException e) {
            def error = [error: "Timed out getting json. URL= ${url}."]
            println error
            return error
        } catch (Exception e) {
            def error = [error: "Failed to get json from web service. ${e.getClass()} ${e.getMessage()} URL= ${url}.",
                         detail: conn.errorStream.text]
            log.error error
            return error
        }
    }

    def doPost(String url, Map postBody) {
        postBody.api_key = grailsApplication.config.api_key
        def resp = ""
        def conn = new URL(url).openConnection()
        try {
            conn.setDoOutput(true)
            conn.setRequestProperty("Content-Type", "application/json");
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream())
            wr.write((postBody as JSON).toString())
            wr.flush()
            resp = conn.inputStream.text
            wr.close()
            return [resp: JSON.parse(resp)]
        } catch (SocketTimeoutException e) {
            def error = [error: "Timed out calling web service. URL= ${url}."]
            log.error error
            return error
        } catch (Exception e) {
            def error = [error: "Failed calling web service. ${e.getMessage()} URL= ${url}.",
                         detail: conn.errorStream.text]
            log.error error
            return error
        }
    }

    def doDelete(String url) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + "api_key=${grailsApplication.config.api_key}"
        def conn = new URL(url).openConnection()
        try {
            conn.setRequestMethod("DELETE")
            return conn.getResponseCode()
        } catch(Exception e){
            println e.message
            return 500
        } finally {
            if (conn != null){
                conn.disconnect()
            }
        }
    }
}
