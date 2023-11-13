<!-- ko stopBinding:true -->
<g:render template="/shared/categorizedReporting"/>

<g:render template="/shared/declaration_bs4" model="${[declarationType:declarationType ?: au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<!-- /ko -->