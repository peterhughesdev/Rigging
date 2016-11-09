var Nunjucks = require('nunjucks');

var env = Nunjucks.configure(null, {
    autoescape : false,
    throwOnUnefined : true
});

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

    env.addFilter('link', function(text, id) {
        return '<a href="#" onclick="rigging.render(' + id + ')">' + text + '</a>';
    });

    env.addExtension('var', {
        tags : ['var'],
        parse : function(parser, nodes, lexer) {
            var token = parser.nextToken();
            var args = parser.parseSignature(null, true);

            parser.advanceAfterBlockEnd(token.value);

            return new nodes.CallExtension(this, 'run', args);
        },
        run : function(context, args) {
            Object.keys(args).forEach(function(key) {
                state.vars[key] = args[key];
            });
        }
    });

    this.parse = function(blob) {
        var parts = blob.split('--').map(function(part) {
             var template = Nunjucks.compile(part, env);

             return function(state) {
                 try {
                     return template.render(state.vars);
                 } catch (e) {
                     opts.onError(e);
                 }
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
