Rigging.core.parser = function(app) {
	this.app = app;
	this.parsers = [];

	var passageMatcher = /^.*=$/g;

	var parsePassage = function(lines) {
		var title = lines.shift();
		var text = lines.join('\n');

		if (!title || !text) return;

		var passage = new Rigging.core.passage(app, Rigging.core.util.UID(), title, text);
		app.addPassage(passage);
	}

	this.parse = function(text) {
		var passage = [], lines = text.split('\n');

		while (lines.length) {
			var line = this.trim(lines.shift());

			if (line.match(passageMatcher)) {
				parsePassage(passage.slice(0, -1));
				passage = passage.slice(-1);
			} else {
				passage.push(line);
			}
		}

		parsePassage(passage);
	}
}

Rigging.core.parser.prototype.addParser = function(matcher, parser) {
	this.parsers.push({
		match : matcher,
		parse : parser
	});
}

Rigging.core.parser.prototype.tokenise = function(passage) {
	var tokens = [];
	
	this.parsers.forEach(function(parser) {
		var matches = parser.match(passage);
		if (matches) {
			matches.forEach(function(match) {
				tokens.push(parser.parse(match, passage));
			});
		}
	});

	return tokens;
}

Rigging.core.parser.prototype.trim = function(text) {
	return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

Rigging.core.parser.normaliseTag = function(tag) {
	return tag.replace(/[\$\{\#\{\@\{\}]/g, "");
}

Rigging.core.parser.normaliseName = function(name) {
	return name.replace(/\./g, "-");
}