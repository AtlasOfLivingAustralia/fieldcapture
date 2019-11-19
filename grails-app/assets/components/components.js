//= require i18n.js
//= require_self
//= require compile/templates.js
//= require_tree javascript

var componentService = function () {
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