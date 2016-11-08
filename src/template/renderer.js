module.exports = function Renderer() {

    this.render = function(section, template) {
         Object.keys(section).forEach(function(key) {
              template.replace('${' + key + '}', section[key]);
         }); 
    };
};
