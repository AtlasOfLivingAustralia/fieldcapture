package au.org.ala.fieldcapture

public class EditModelWidgetRenderer implements ModelWidgetRenderer {

    @Override
    void renderLiteral(WidgetRenderContext context) {
        context.writer << "<span ${context.attributes.toString()}>${context.model.source}</span>"
    }

    @Override
    void renderText(WidgetRenderContext context) {
        context.attributes.addClass context.getInputWidth()
        context.databindAttrs.add 'value', context.source
        context.writer << "<input ${context.attributes.toString()} data-bind='${context.databindAttrs.toString()}' ${context.validationAttr} type='text' class='input-small'/>"
    }

    @Override
    void renderNumber(WidgetRenderContext context) {
        context.attributes.addClass context.getInputWidth()
        context.attributes.add 'style','text-align:center'
        context.databindAttrs.add 'value', context.source
        context.writer << "<input${context.attributes.toString()} data-bind='${context.databindAttrs.toString()}'${context.validationAttr} type='text' class='input-mini'/>"
    }

    @Override
    void renderBoolean(WidgetRenderContext context) {
        context.databindAttrs.add 'checked', context.source
        context.writer << "<input${context.attributes.toString()} name='${context.source}' data-bind='${context.databindAttrs.toString()}'${context.validationAttr} type='checkbox' class='checkbox'/>"
    }

    @Override
    void renderTextArea(WidgetRenderContext context) {
        context.databindAttrs.add 'value', context.source
        context.writer << "<textarea ${context.attributes.toString()} data-bind='${context.databindAttrs.toString()}'></textarea>"
    }

    @Override
    void renderSimpleDate(WidgetRenderContext context) {
        context.databindAttrs.add 'datepicker', context.source + '.date'
        context.writer << "<input${context.attributes.toString()} data-bind='${context.databindAttrs.toString()}'${context.validationAttr} type='text' class='input-small'/>"
    }

    @Override
    void renderSelectOne(WidgetRenderContext context) {
        context.databindAttrs.add 'value', context.source
        // Select one or many view types require that the data model has defined a set of valid options
        // to select from.
        context.databindAttrs.add 'options', 'transients.' + context.model.source + 'Constraints'
        context.databindAttrs.add 'optionsCaption', '"Please select"'
        context.writer <<  "<select${context.attributes.toString()} data-bind='${context.databindAttrs.toString()}'${context.validationAttr}></select>"
    }

    @Override
    void renderSelectMany(WidgetRenderContext context) {
        context.labelAttributes.addClass 'checkbox-list-label '
        def constraints = 'transients.' + context.model.source + 'Constraints'
        context.databindAttrs.add 'value', '\$data'
        context.databindAttrs.add 'checked', "\$root.${context.source}"
        context.writer << """
            <ul class="checkbox-list" data-bind="foreach: ${constraints}">
                <li>
                    <input type="checkbox" name="${context.source}" data-bind="${context.databindAttrs.toString()}" ${context.validationAttr}/><span data-bind="text:\$data"></span>
                </li>
            </ul>
        """
    }

    @Override
    void renderImage(WidgetRenderContext context) {
        context.addDeferredTemplate('/output/fileUploadTemplate')
        context.databindAttrs.add 'fileUpload', context.source
        context.writer << context.g.render(template: '/output/imageDataTypeTemplate', model: [databindAttrs:context.databindAttrs.toString(), source: context.source])
    }

    @Override
    void renderEmbeddedImage(WidgetRenderContext context) {
        context.addDeferredTemplate('/output/fileUploadTemplate')
        context.databindAttrs.add 'fileUpload', context.source
        context.writer << context.g.render(template: '/output/imageDataTypeTemplate', model: [databindAttrs: context.databindAttrs.toString(), source: context.source])
    }

    @Override
    void renderEmbeddedImages(WidgetRenderContext context) {
        // The file upload template has support for muliple images.
        renderEmbeddedImage(context)
    }

    @Override
    void renderAutocomplete(WidgetRenderContext context) {
        def newAttrs = new Databindings()
        def link = context.g.createLink(controller: 'search', action:'species')

        newAttrs.add "value", "transients.textFieldValue"
        newAttrs.add "event", "{focusout:focusLost}"
        newAttrs.add "autocomplete", "{url:'${link}', render: renderItem, listId: list, result:speciesSelected, valueChangeCallback:textFieldChanged}"

        context.writer << context.g.render(template: '/output/speciesTemplate', model:[source: context.source, databindAttrs: newAttrs.toString(), validationAttrs:context.validationAttr])
    }

    @Override
    void renderPhotoPoint(WidgetRenderContext context) {
        context.writer << """
        <div><b><span data-bind="text:name"/></b></div>
        <div>Lat:<span data-bind="text:lat"/></div>
        <div>Lon:<span data-bind="text:lon"/></div>
        <div>Bearing:<span data-bind="text:bearing"/></div>
        """
    }

    @Override
    void renderLink(WidgetRenderContext context) {
        context.writer << "<a href=\"" + context.g.createLink(context.specialProperties(context.model.properties)) + "\">${context.model.source}</a>"
    }

    @Override
    void renderDate(WidgetRenderContext context) {
        context.writer << "<div class=\"input-append\"><input data-bind=\"datepicker:${context.source}.date\" type=\"text\" size=\"12\"${context.validationAttr}/>"
        context.writer << "<span class=\"add-on open-datepicker\"><i class=\"icon-th\"></i></span></div>"
    }

}
