<!-- ko stopBinding: true -->
<%@ page import="au.org.ala.merit.SettingPageType" expressionCodec="none"%>
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

           <a class="form-control btn btn-success text-white" target="_blank" data-bind="attr:{href:requestLabelUrl}">Request labels <i class="fa fa-external-link-square"></i></a>
           </div>
       </form>
    </div>
</div>
<!-- /ko -->
