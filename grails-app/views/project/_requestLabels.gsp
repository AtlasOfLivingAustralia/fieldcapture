<!-- ko stopBinding: true -->
<%@ page import="au.org.ala.merit.SettingPageType" expressionCodec="none"%>

<g:set var="userNotAssignedToProject" value="${fc.userIsSiteAdmin() && !user?.isCaseManager}"/>
<g:if test="${userNotAssignedToProject}">
    <div class="alert alert-info">
        If you need to request barcode labels for this project, you must first add yourself to the project as a Grant Manager
    </div>
</g:if>

<div class="row">
    <div class="col-sm-12">
        <h3>Request voucher barcode labels</h3>
    </div>
</div>
<div class="row">
    <div class="col-sm-12">
        <fc:getSettingContent settingType="${SettingPageType.PLANT_LABEL_INSTRUCTIONS}"/>
    </div>
</div>
<div class="row">
    <div class="col-sm-12">
       <form id="request-label-form" class="form-inline">
           <div class="form-group">
           <label for="pageCount">Number of pages to request</label>
           <input class="form-control input-small  m-2" id="pageCount" type="number" name="pageCount" data-bind="value:pageCount">

               <g:if test="${userNotAssignedToProject}">
                   <button class="form-control btn btn-success text-white" disabled="disabled">Request labels <i class="fa fa-external-link-square"></i></button>
               </g:if>
               <g:else>
                    <a class="form-control btn btn-success text-white" target="_blank" data-bind="attr:{href:requestLabelUrl}">Request labels <i class="fa fa-external-link-square"></i></a>
               </g:else>
           </div>
       </form>
    </div>
</div>
<!-- /ko -->
