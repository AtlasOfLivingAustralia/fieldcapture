/*
 * Copyright (C) 2013 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 */

package au.org.ala.fieldcapture
import grails.converters.JSON
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException

class WebService {

    def grailsApplication, userService

    def get(String url, boolean includeUserId) {
        def conn = new URL(url).openConnection()
        try {
            conn.setConnectTimeout(10000)
            conn.setReadTimeout(50000)
            if (includeUserId && getUserId()) {
                conn.setRequestProperty(grailsApplication.config.app.http.header.userId, getUserId())
            }
            return conn.content.text
        } catch (SocketTimeoutException e) {
            def error = [error: "Timed out calling web service. URL= ${url}."]
            log.error error
            return error
        } catch (Exception e) {
            def error = [error: "Failed calling web service. ${e.getClass()} ${e.getMessage()} URL= ${url}.",
                    statusCode: conn.responseCode?:"",
                    detail: conn.errorStream?.text]
            log.error error
            return error
        }
    }

    def get(String url) {
        return get(url, true)
    }

    def getJson(String url) {
        def conn = new URL(url).openConnection()
        try {
            conn.setConnectTimeout(10000)
            conn.setReadTimeout(50000)
            if (getUserId()) {
                conn.setRequestProperty(grailsApplication.config.app.http.header.userId, getUserId())
            }
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
        } catch (ConnectException ce) {
            log.info "Exception class = ${ce.getClass().name} - ${ce.getMessage()}"
            def error = [error: "ecodata service not available. URL= ${url}."]
            println error
            return error
        }catch (Exception e) {
            log.info "Exception class = ${e.getClass().name} - ${e.getMessage()}"
            def error = [error: "Failed to get json from web service. ${e.getClass()} ${e.getMessage()} URL= ${url}.",
                         statusCode: conn.responseCode?:"",
                         detail: conn.errorStream?.text]
            log.error error
            return error
        }
    }

    def doPost(String url, Map postBody) {
        if(!postBody.api_key){
            postBody.api_key = grailsApplication.config.api_key
        }

        def resp = ""
        def conn = new URL(url).openConnection()
        try {
            conn.setDoOutput(true)
            conn.setRequestProperty("Content-Type", "application/json");
            if (getUserId()) {
                conn.setRequestProperty(grailsApplication.config.app.http.header.userId, getUserId())
            }
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream())
            wr.write((postBody as JSON).toString())
            wr.flush()
            resp = conn.inputStream.text
            wr.close()
            return [resp: JSON.parse(resp)]
        } catch (SocketTimeoutException e) {
            def error = [error: "Timed out calling web service. URL= ${url}."]
            log.error(error, e)
            return error
        } catch (Exception e) {
            def error = [error: "Failed calling web service. ${e.getMessage()} URL= ${url}.",
                    statusCode: conn.responseCode?:"",
                    detail: conn.errorStream?.text]
            log.error(error, e)
            return error
        }
    }

    def doDelete(String url) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + "api_key=${grailsApplication.config.api_key}"
        def conn = new URL(url).openConnection()
        try {
            conn.setRequestMethod("DELETE")
            if (getUserId()) {
                conn.setRequestProperty(grailsApplication.config.app.http.header.userId, getUserId())
            }
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

    private getUserId() {
        userService.getUser()?.userId
    }
}
