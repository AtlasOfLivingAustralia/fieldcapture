package au.org.ala.fieldcapture

/**
 * Renders output scores for display on a project or program dashboard.
 */
class DashboardTagLib {
    static namespace = "fc"

    /**
     * Expects a single attribute with name "score" containing the result from an aggregation.
     */
    def renderScore = {attrs, body ->
        def score = attrs.score

        try {

            def target = score.target ? score.target as Double : 0
            // A zero target essentially means not a target.
            if (target > 0 && score.score.isOutputTarget && !score.groupTitle) {
                renderTarget(score, target)
            }
            else if (!score.groupTitle) {
                renderSingleScore(score)
            }
            else {
                renderGroupedScore(score)
            }
        }
        catch (Exception e) {
            log.warn("Found non-numeric target or result for score: ")
        }

    }

    def pieChart = {attrs, body ->
        def columnDefs = [['string', attrs.label], ['number', 'Count']]
        def chartData = []
        attrs.data.each{ key, value ->
            chartData << [key, value]
        }
        drawPieChart(attrs.label, attrs.title, columnDefs, chartData)
    }

    /**
     * Renders the value of a score alongside it's target value as a progress bar.
     * @param score the score being rendered
     * @param target the target value for the score
     */
    private void renderTarget(score, double target) {
        def result = score.results ? score.results[0].result as Double : 0
        def percentComplete = result / target * 100


        out << """
            <strong>${score.score.label}</strong><span class="pull-right progress-label ${percentComplete >= 99 ? 'progress-100':''}">${result}/${score.target}</span>
                <div class="progress progress-info active ">
                <div class="bar" style="width: ${percentComplete}%;"></div>
            </div>"""
    }

    private void renderSingleScore(score) {
        switch (score.score.aggregationType.name) {

            case 'SUM':
            case 'AVERAGE':
            case 'COUNT':
                def result = score.results ? score.results[0].result as Double : 0
                out << "<div><b>${score.score.label}</b> : ${g.formatNumber(type:'number',number:result, maxFractionDigits: 2, groupingUsed:true)}</div>"
                break
            case 'HISTOGRAM':
                def chartData = []
                score.results[0].result.each {key, value ->
                    chartData << [key, value]
                }
                drawPieChart(score.score.label, score.score.label, [['string', score.score.label], ['number', 'Count']], chartData)
                break
            case 'SET':
                out << "<div><b>${score.score.label}</b> :${score.results[0].result.join(',')}</div>"
                break
        }
    }

    private void renderGroupedScore(score) {
        switch (score.score.aggregationType.name) {
            case 'SUM':
            case 'AVERAGE':
            case 'COUNT':
                def chartData = []
                score.results.each({
                    chartData << [it.group, it.result]
                })
                drawPieChart(score.score.label, score.groupTitle, [['string', score.groupTitle], ['number', score.score.label]], chartData)

                break
            case 'HISTOGRAM':
                break

        }
    }

    private void drawPieChart(label, title, columns, data) {
        def chartId = label + '_chart'
        out << "<div id=\"${chartId}\"></div>"

        out << gvisualization.pieCoreChart([elementId: chartId, title: title, columns: columns, data: data, width:'450', height:'300', backgroundColor: '#ebe6dc'])
    }


}
