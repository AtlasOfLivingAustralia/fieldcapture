<div class="row-fluid statistics">
    %{--This section expects exactly 6 statistics to display--}%
    <div class="row-fluid">
        <div class="span4 box1">
            <g:render template="/report/statistic" model="${statistics[0]}"/>
        </div>
        <div class="span4 box2">
            <g:render template="/report/statistic" model="${statistics[1]}"/>
        </div>
        <div class="span4 box3">
            <g:render template="/report/statistic" model="${statistics[2]}"/>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span4 box4">
            <g:render template="/report/statistic" model="${statistics[3]}"/>
        </div>
        <div class="span4 box5">
            <g:render template="/report/statistic" model="${statistics[4]}"/>
        </div>
        <div class="span4 box6">
            <g:render template="/report/statistic" model="${statistics[5]}"/>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12 text-center"><a href="#" class="show-more-stats">Show more stats <i class="fa fa-refresh"></i></a></div>
    </div>
</div>
