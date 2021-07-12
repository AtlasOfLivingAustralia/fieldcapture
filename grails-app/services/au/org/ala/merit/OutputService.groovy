package au.org.ala.merit

import org.springframework.beans.factory.annotation.Value

class OutputService {

    WebService webService

    @Value('${ecodata.baseUrl}+output/')
    private String outputPath

    def get(String id) {
        def record = webService.getJson(outputPath + id)
        record
    }

    def update(String id, Map body) {
        webService.doPost(outputPath + id, body)
    }

    def delete(String id) {
        webService.doDelete(outputPath + id)
    }

}
