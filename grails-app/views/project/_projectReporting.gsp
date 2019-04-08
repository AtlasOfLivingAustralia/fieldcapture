
<g:render template="/shared/categorizedReporting"></g:render>
<g:render template="/shared/declaration" model="${[declarationType:au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<g:render template="/shared/reportRejectionModal"/>
<script type="text/html" id="adjustment-instructions">
<fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.REPORT_ADJUSTMENT_INSTRUCTIONS}"/>
</script>
