


<div>

    <fc:groupedTable elementId="gatable" scores="${
        ['No. non indigenous participants starting accredited training', 'No. indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. indigenous participants commencing non-accredited training',
         'No. of non indigenous Participants who exited training during period', 'No. of indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period', 'No. of indigenous Participants who completed training in period',
        'No. of non indigenous Participants who commenced projects in period', 'No. of indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who did not complete projects in period',
        'No. of non indigenous Participants who completed projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>

<div>
    Indigenous Training participation by Month
    <fc:groupedChart elementId="trainingchartindigenous" scores="${['No. indigenous participants starting accredited training', 'No. indigenous participants commencing non-accredited training', 'No. of indigenous Participants who exited training during period', 'No. of indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>

<div>
    Non-Indigenous Training participation by Month
    <fc:groupedChart elementId="trainingchartnonindigenous" scores="${['No. non indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. of non indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>


<div>
    Indigenous Project participation by Month
    <fc:groupedChart elementId="projectchartindigenous" scores="${['No. of indigenous Participants who commenced projects in period', 'No. of indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>

<div>
    Non-Indigenous Project participation by Month
    <fc:groupedChart elementId="projectchartnonindigenous" scores="${['No. of non indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of Participants who completed Projects in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>
