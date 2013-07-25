<%--
  Created by IntelliJ IDEA.
  User: dos009
  Date: 5/07/13
  Time: 12:32 PM
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Search Results</title>
</head>
<body>
<div id="wrapper" class="container-fluid">
    <div class="row-fluid">
        <div class="span12" id="header">
            <h1 class="pull-left">Search Results</h1>
            <g:form controller="search" method="GET" class="hide form-horizontal pull-right" style="padding-top:5px;">
                <div class="input-append">
                    <g:textField class="input-large" name="query" value="${params.query}"/>
                    <button class="btn" type="submit">Search</button>
                </div>
            </g:form>
        </div>

        <g:if test="${flash.error}">
            <div class="row-fluid">
                <div class="alert alert-error">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <span>${flash.error}</span>
                </div>
            </div>
        </g:if>
    </div>
    <g:if test="${results.hits?.total?:0 > 0}">
        <div class="row-fluid ">
            <div class="span9">
                <p class="lead">
                    <fc:searchResultsCounts max="${params.max?:10}" offset="${params.offset?:0}" total="${results.hits.total}"/>
                    <strong>${(params.query=="*:*")?"[all records]":params.query}</strong>
                </p>
            </div>
            <div class="span3 pull-right" style="text-align: right;">
                <g:form class="max" controller="search" method="GET">
                    <g:hiddenField name="query" value="${params.query}"/>
                    <g:hiddenField name="offset" value="${params.offset}"/>
                %{--<g:hiddenField name="sort" value="${params.sort}"/>--}%
                %{--<g:hiddenField name="order" value="${params.order}"/>--}%
                    Items per page:
                    <g:select name="max" from="${[10,20,50,100]}" value="${params.max}" class="btn btn-small" style="width:auto;"
                              onChange="console.log('change');jQuery('form.max').submit();"/>
                </g:form>
            </div>
        </div>
        <div id="content" class="row-fluid ">
            <div id="facetsCol" class="span3 well well-small">
                <h2>Filter results</h2>
                <g:set var="facets" value="${results.facets}"/>
                <h4>Page</h4>
                <!-- ${facets['class']} -->
                <ul class="pageType">
                    <g:each var="t" in="${facets['class'].terms}">
                        <g:set var="fqLink" value="${request.queryString}"/>
                    %{--<g:set var="fqLink" value="${params.collect { k,v -> "${k.encodeAsURL()}=${v.encodeAsURL()}" }.join('&')}"/>--}%
                        <li><a href="?${fqLink}&fq=class:${t.term}"><g:message code="label.${t.term?.toLowerCase()}" default="${t.term}"/></a> (${t.count})</li>
                    </g:each>
                </ul>
                <g:each var="f" in="${facets}">
                    <g:if test="${f.key != 'class' && f.value?.terms?.length() > 0}">
                        <h4>${f.key?.capitalize()}</h4>
                        <ul class="facetValues">
                            <g:each var="t" in="${f.value?.terms}">
                                <g:set var="fqLink" value="${request.queryString}"/>
                            %{--<g:set var="fqLink" value="${params.collect { k,v -> "${k.encodeAsURL()}=${v.encodeAsURL()}" }.join('&')}"/>--}%
                                <li><a href="?${fqLink}&fq=${f.key.encodeAsURL()}Facet:${t.term}">${t.term?.replace("_"," ")}</a> (${t.count})
                                </li>
                            </g:each>
                        </ul>
                    </g:if>
                </g:each>
            </div>
            <div class="span9">
                <g:if test="${results.hits?.total > 0}">
                    <table class="table table-bordered table-condensed table-striped">
                        <thead>
                        <tr><th>Page</th><th>Details</th><th>Date created</th></tr>
                        </thead>
                        <tbody>
                        <g:each var="r" in="${results.hits.hits}">
                            <g:set var="hit" value="${r._source}"/>
                            <g:set var="highlights" value="${r.highlight?._all}"/>
                            <tr>
                                <td><g:message code="label.${hit.class.toLowerCase()}" default="${hit.class}"/></td>
                                <td>
                                    <g:if test="${hit.class=~/Project/}">
                                        <g:link controller="project" id="${hit.projectId}">${hit.name}</g:link>
                                    </g:if>
                                    <g:if test="${hit.class=~/Site/}">
                                        <g:link controller="site" id="${hit.siteId}">${hit.name}</g:link>
                                    </g:if>
                                    <g:elseif test="${hit.class=~/Activity/}">
                                        <g:link controller="activity" id="${hit.activityId}">${hit.name?:hit.type}</g:link>
                                    </g:elseif>
                                    <g:else>
                                        ${hit.type}
                                    </g:else>
                                    <g:if test="${highlights}">
                                        &mdash; ${highlights?.join("; ")?.replace("\\/","/")}
                                    </g:if>
                                </td>
                                <td><fc:formatDateString date="${hit.dateCreated}" inputFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"/></td>
                            </tr>
                        </g:each>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <g:paginate controller="search" total="${results.hits?.total}" params="${params}" />
                    </div>
                </g:if>
            </div>
        </div>
    </g:if>
    <g:else>
        <div class="row-fluid ">
            <div class="span12">
                No results found for <strong>${params.query}</strong>
            </div>
        </div>
    </g:else>

</div>
</body>
</html>