<div id="${id}" class="alert d-none">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <strong>Unsaved data has been restored.</strong>
    <p>Press ${saveButton?:'Save'} to apply the changes to your project<g:if test="${cancelButton}"> or ${cancelButton} to discard these edits</g:if></p>
</div>
