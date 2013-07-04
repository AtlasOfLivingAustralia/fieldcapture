<div id="fileupload"  data-url="<g:createLink controller='image' action='upload'/>" data-bind="${databindAttrs}" class="fileupload-buttonbar">

    <!-- The fileinput-button span is used to style the file input field as button -->
    <span class="btn btn-success fileinput-button">
        <i class="icon-plus icon-white"></i>
        <input type="file" name="files" multiple />
        <img src="${resource(dir:'images/icons',file:'add-image-4.png')}"/><br/>
        <span>Add images</span>

    </button>
    </span>
    <table><tbody class="files"></tbody></table>
    <span class=".existingImages"></span>
</div>