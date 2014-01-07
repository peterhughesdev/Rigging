Rigging.core.event = function() {

}

Rigging.core.events = function(app) {
	var self = this;

	this.app = app || {};
	this.listeners = {};

	this.emit = function(ns, e) {
		var parts = ns.split(".");

		do {
			ns = parts.join(".");
			if (self.listeners[ns]) {
				self.listeners[ns].forEach(function(listener) {
					listener.call(app, e);
				});
			}
		} while (parts.length --> 1);
	}
}

Rigging.core.events.prototype.addListener = function(ns, fn) {
	this.listeners[ns] = this.listeners[ns] || [];
	this.listeners[ns].push(fn);
}