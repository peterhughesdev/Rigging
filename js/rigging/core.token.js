Rigging.core.token = function(tag, type, args) {
	this.tag = tag;
	this.type = type;
	this.args = args;
}

Rigging.core.token.prototype.init = function(passage, app) {
	var types = Rigging.core.token.types;

	switch (this.type) {
		case types.VAR : this.__initVar(passage, app); break;
		case types.LOCAL_VAR : this.__initLocalVar(passage, app); break;
		case types.EVENT_LISTENER : this.__initEventListener(passage, app); break;
	}
}

Rigging.core.token.prototype.__initVar = function(passage, app) {
	var norm = Rigging.core.parser.normaliseName;

	var name = norm(this.args[0]),
		value = this.args[1] || "";

	value = typeof value == 'function' ? value() : value;
	passage.registry.add(name, app.registry.add(name, ko.observable(value).extend({markdown:null})));
}

Rigging.core.token.prototype.__initEventListener = function(passage, app) {
	var ns = this.args[0],
		fn = app.registry.get(this.args[1]),
		args = this.args.slice(2);

	if (fn && typeof fn == 'function') {
		app.events.addListener(ns, function(e) {
			fn.apply(app, args.concat(e));
		});
	}
}

Rigging.core.token.types = {
	FN : "t_fn",
	VAR : "t_v",
	LOCAL_VAR : "t_lv",
	EVENT_SOURCE : "t_es",
	EVENT_LISTENER : "t_l"
}