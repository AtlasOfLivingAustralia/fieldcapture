<div class="row">
    <g:if test="${flash.errorMessage}">
        <div class="${containerType}">
            <div class="alert alert-danger">
                ${flash.errorMessage}
            </div>
        </div>
    </g:if>

    <g:if test="${flash.message}">
        <div class="row">
            <div class="col-sm-6 alert alert-info" style="margin-bottom:0;">
                <button class="btn-close" onclick="$('.alert').fadeOut();" href="#">×</button>
                ${flash.message}
            </div>
        </div>
    </g:if>
</div>
