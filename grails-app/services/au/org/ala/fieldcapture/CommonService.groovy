package au.org.ala.fieldcapture

import javax.xml.bind.DatatypeConverter
import java.text.SimpleDateFormat

class CommonService {

    def simpleDateLocalTime(String dateStr) {
        if (!dateStr) { return '' }
        def cal = DatatypeConverter.parseDateTime(dateStr)
        def date = cal.getTime()
        new SimpleDateFormat("dd/MM/yy").format(date)
    }
}
