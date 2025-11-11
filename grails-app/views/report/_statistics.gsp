<div class="statistics">
    <g:if test="${statistics}">
    %{--This section expects exactly 6 statistics to display--}%
    <div class="row">
        <div class="col-xl-4 col-lg-6 col-sm-12 box1">
            <g:render template="/report/statistic" model="${statistics[0]}"/>
        </div>
        <div class="col-xl-4 col-lg-6 col-sm-12 box2">
            <g:render template="/report/statistic" model="${statistics[1]}"/>
        </div>
        <div class="col-xl-4 col-lg-6 col-sm-12 box3">
            <g:render template="/report/statistic" model="${statistics[2]}"/>
        </div>
        <div class="col-xl-4 col-lg-6 col-sm-12 box4">
            <g:render template="/report/statistic" model="${statistics[3]}"/>
        </div>
        <div class="col-xl-4 col-lg-6 col-sm-12 box5">
            <g:render template="/report/statistic" model="${statistics[4]}"/>
        </div>
        <div class="col-xl-4 col-lg-6 col-sm-12 box6">
            <g:render template="/report/statistic" model="${statistics[5]}"/>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-12 align-content-center text-center"><a href="#" class="show-more-stats text-dark">Show more stats <i class="fa fa-refresh"></i></a></div>
    </div>
    </g:if>
</div>
