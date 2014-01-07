Rigging.core.registry = function() {
	var container = {};

	this.add = function(name, v) {
		return this[name] = v;
	}

	this.get = function(name) {
		return this[name];
	}
}