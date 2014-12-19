


<div>

    <fc:groupedTable elementId="gatable" scores="${['No. starting accredited training', 'No. starting non-accredited training', 'Total No. of participants who completed training', 'No. who exited training', 'No. who completed training', 'No. of Participants who commenced Projects in period', 'No. of Participants who did not complete projects in period', 'No. of Participants who completed Projects in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>

<div>
    Training participation by Month
    <fc:groupedChart elementId="trainingchart" scores="${['No. starting accredited training', 'No. starting non-accredited training', 'No. who exited training', 'No. who completed training'].collect{[label:it]}}" data="${report.outputData}"/>
</div>


<div>
    Project participation by Month
    <fc:groupedChart elementId="projectchart" scores="${['No. of Participants who commenced Projects in period', 'No. of Participants who did not complete projects in period', 'No. of Participants who completed Projects in period'].collect{[label:it]}}" data="${report.outputData}"/>
</div>
