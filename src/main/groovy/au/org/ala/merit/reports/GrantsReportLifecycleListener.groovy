package au.org.ala.merit.reports

class GrantsReportLifecycleListener extends NHTOutputReportLifecycleListener {

    @Override
    Map getContextData(Map project, Map report, Map activity) {
        Map contextData = super.getContextData(project, report, activity)
        return contextData
    }
}
