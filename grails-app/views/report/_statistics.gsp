%{--This section expects exactly 6 statistics to display--}%
<div class="row-fluid">
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[0]}"/>
    </span>
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[1]}"/>
    </span>
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[2]}"/>
    </span>
</div>
<div class="row-fluid">
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[3]}"/>
    </span>
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[4]}"/>
    </span>
    <span class="span4">
        <g:render template="/report/statistic" model="${statistics[5]}"/>
    </span>
</div>
<div class="row-fluid">
    <span class="span12 text-center">Show more stats <i class="icon-refresh"></i></span>
</div>