var Handlebars = require('handlebars');

module.exports = function Rigging(opts) {
    var state = {
        vars : {
            greeting : true,
            foo : "World"
        },
        parts : [],
        current : 0
    };

    var self = this;

    this.set = function(name, val) {
        state.vars[name] = val;
    };

    this.get = function(name) {
        return state.vars[name];
    };

    this.parse = function(blob) {
        var parts = blob.split('--').map(function(part) {
             var template = Handlebars.compile(part);

             return function(state) {
                 return template(state.vars);
             }
         });

         state.parts = parts;
         
         self.render();
    }

    this.render = function() {
        document.querySelector(opts.el).innerHTML = state.parts[state.current](state);
    }
}
