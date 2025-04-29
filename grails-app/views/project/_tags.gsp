<div class="project-tags">
    <h3>Add tags to project</h3>
    <p>
        Add tags to help identify the project when using the project explorer.  Please only use approved tags.
    </p>
    <form>
        <label for="tags">Tags</label>
        <select multiple="multiple" id="tags" data-bind="options:transients.projectTags,  multiSelect2:{value:tags, placeholder:'Add your tag/s here', tags:false}" class="form-control form-control-sm input-small"></select>
        <button class="btn btn-success" data-bind="click:saveTags, enable:tagsChanged">Save changes</button>
    </form>
</div>