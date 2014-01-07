var Rigging = (function() {
	var RiggingEngine = function(ns) {
		var self = this;

		this.passages = ko.observableArray([]);
		
		this.events = new ns.core.events(this);
		this.parser = new ns.core.parser(this);
		this.registry = new ns.core.registry(this);
		this.formatter = new ns.core.formatter(this);
		
		this.addPassage = function(passage) {
			console.log(passage);

			self.formatter.createTemplate(passage);
			self.passages.push(passage);
		}

		for (var p in ns.core.parser.parsers) {
			var parser = ns.core.parser.parsers[p];
			this.parser.addParser(parser.matcher, parser.parser);
		}

		for (var f in ns.core.formatter.formatters) {
			this.formatter.addFormatter(f, ns.core.formatter.formatters[f]);
		}

		ko.applyBindings(this);
	};

	return { 
		core : {},
		create : function() {
			return new RiggingEngine(this);
		}
	};
}());