//= require i18n.js
//= require ecodata-components.js
//= require_self
//= require_tree compile
//= require_tree javascript

if (typeof componentService === "undefined") {
    componentService = function () {
        var cache = {};
        function getTemplate(name) {
            return cache[name];
        };

        function setTemplate(name, template) {
            cache[name] = template;
        };

        return {
            getTemplate: getTemplate,
            setTemplate: setTemplate
        };
    }();
}
