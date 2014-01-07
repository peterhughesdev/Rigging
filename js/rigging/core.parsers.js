Rigging.core.parser.parsers = (function(ns) {
	var trim = Rigging.core.parser.prototype.trim,
		norm = Rigging.core.parser.normaliseTag,
		type = Rigging.core.token.types;

	var parsers = {};
    parsers[type.VAR] = /\$\{([\d\w\s]*)\b[^\}]*\}/g;
	parsers[type.EVENT_SOURCE] = /\#\{([\d\w\s]*)\b[^\}]*\}/g;
	parsers[type.EVENT_LISTENER] = /\@\{([\d\w\s]*)\b[^\}]*\}/g;

	for (var type in parsers) {
		ns[type] = (function(type) {
			var regex = parsers[type];
			return {
				matcher : function(passage) {
					return passage.text.match(regex);
				},
				parser : function(match) {
					var args = [], parts = norm(match).split("|"); // Break tag into pipe-delimited args
					parts.forEach(function(part) {
						args.push(trim(part));
					});

					return new Rigging.core.token(match, type, args);
				}
			}
		}(type));
	}

	return ns;
}({}));
