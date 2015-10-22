%{--This section expects exactly 6 statistics to display--}%
<div class="row-fluid">
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[0]}"/>
    </div>
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[1]}"/>
    </div>
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[2]}"/>
    </div>
</div>
<div class="row-fluid">
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[3]}"/>
    </div>
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[4]}"/>
    </div>
    <div class="span4">
        <g:render template="/report/statistic" model="${statistics[5]}"/>
    </div>
</div>
<div class="row-fluid">
    <div class="span12 text-center">Show more stats <i class="fa fa-refresh"></i></div>
</div>