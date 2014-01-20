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

/**
 * Enum class for static content (Setting Page)
 *
 * @author "Nick dos Remedios <Nick.dosRemedios@csiro.au>"
 */
enum SettingPageType {
    ABOUT ("about","About","fielddata.about.text"),
    DESCRIPTION ("description","Description","fielddata.description.text"),
    FOOTER ("footer","Footer","fielddata.footer.text"),
    ANNOUNCEMENT ("announcement","Announcement","fielddata.announcement.text"),
    HELP ("help","Help","fielddata.help.text"),
    NEWS ("news","News","fielddata.news.text"),
    CONTACTS ("contacts","Contacts","fielddata.contacts.text"),
    INTRO ("intro","User Introduction","fielddata.introduction.text"),
    DECLARATION ('declaration', "Legal Declaration", "fielddata.declaration.text"),
    REPORT_SUBMITTED_EMAIL('reportSubmitted', 'Report has been submitted email body text', 'fielddata.reportSubmitted.emailText'),
    REPORT_APPROVED_EMAIL('reportApproved', 'Report has been approved email body text', 'fielddata.reportApproved.emailText'),
    REPORT_REJECTED_EMAIL('reportRejected', 'Report has been rejected email body text', 'fielddata.reportRejected.emailText')
    String name
    String title
    String key

    public SettingPageType(name, title, key) {
        this.name = name
        this.title = title
        this.key = key
    }

    public static SettingPageType getForName(String name) {
        for(SettingPageType s : values()){
            if (s.name == name){
                return s
            }
        }
    }

    public static SettingPageType getForKey(String key) {
        for(SettingPageType s : values()){
            if (s.key == key){
                return s
            }
        }
    }
}
