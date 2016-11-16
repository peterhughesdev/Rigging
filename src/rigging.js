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
        current : 'start' 
    };

    var self = this;

    env.addFilter('link', function(text, id) {
        return '<a href="#" onclick="rigging.render(\'' + id + '\')">' + text + '</a>';
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

    var matcher = /--[a-zA-Z]*--/g;

    this.parse = function(blob) {
        var sections = blob.split(matcher) || [];
        var titles = blob.match(matcher) || [];

        if (titles.length === sections.length - 1) {
            titles.unshift('start');
        }

        var parts = {};
        
        sections.forEach(function(part, i) {
             var template = Nunjucks.compile(part, env);

             var title = titles[i].substring(2, titles[i].length - 2);

             parts[title] = function(state) {
                 try {
                     return template.render(state.vars);
                 } catch (e) {
                     opts.onError(e);
                 }
             };
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
