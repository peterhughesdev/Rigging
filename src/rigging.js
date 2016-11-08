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

    Handlebars.registerHelper('goto', function(id, text) {
        return new Handlebars.SafeString('<a href="#" onclick="rigging.render(' + id + ')">' + text + '</a>');
    });

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

    this.render = function(part) {
        if (part === undefined) {
            part = state.current;
        }

        state.current = part;

        opts.render(state.parts[part](state));
    }
}
