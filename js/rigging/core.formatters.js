Rigging.core.formatter.formatters = (function(ns) {
	var types = Rigging.core.token.types,
		trim = Rigging.core.parser.prototype.trim,
		norm = Rigging.core.parser.normaliseName;

	var events = ['click', 'dblclick', 'mouseover', 'mouseout'];
	var eventConstructor = function(type, ns, args, passage) {
		var self = this, emitter = this.events, namespace = type + "." + ns;
		return function(e) {
			emitter.emit(namespace, {
				e : e,
				type : type,
				args : args,
				passage : passage,
				namespace : namespace
			});
		};
	}

	ns[types.VAR] = function(token) {
		var name = norm(token.args[0]);
		return "<div class=\"var var-" + name + "\" data-bind=\"html : registry." + name + "\"></div>";
	};

	ns[types.EVENT_SOURCE] = function(token, passage) {
		var args = [], handlers = {};

		token.args.forEach(function(a) {
			args.push(trim(a));
		})

		var ns = args.shift(), name = norm(ns), value = args.shift();
		
		events.forEach(function(e) {
			handlers[e] = eventConstructor.call(this, e, ns, args, passage);
		}.bind(this));
		

		$('body').on(handlers, '.trigger-' + name);
		return "<div class=\"trigger trigger-" + name + "\">" + value + "</div>";
	}

	ns[types.EVENT_LISTENER] = function(token) {
		return "";
	}

	return ns;
}({}));