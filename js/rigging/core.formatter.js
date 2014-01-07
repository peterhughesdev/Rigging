(function() {
	ko.extenders.markdown = function(target) {
		var result = ko.computed({
	        read: function() {
	            return markdown.toHTML(target()); 
	        },
	        write: target 
	    });

	    result.raw = target;
	    return result;
	}
}());

Rigging.core.formatter = function(app) {
	var self = this;

	this.app = app;
	this.body = $('body');

	this.formats = {};
	this.templates = {};
	
	this.getTemplate = function(passage) {
		return self.templates[passage.id];
	}
}

Rigging.core.formatter.prototype.addFormatter = function(type, formatter) {
	if (!this.formats[type]) {
		this.formats[type] = [];
	}

	this.formats[type].push(formatter);
}

Rigging.core.formatter.prototype.createTemplate = function(passage) {
	var html = passage.text, 
		templateName = "tpl-passage-" + passage.id;

	passage.tokens.forEach(function(token) {
		var tags = [], 
			formatters = this.formats[token.type];

		if (formatters) {
			formatters.forEach(function(f) {
				tags.push(f.call(this.app, token, passage, tags));
			}.bind(this));
			
			html = html.replace(token.tag, tags.join(""));
		}
	}.bind(this));

	html = "<script id=\"" + templateName + "\" type=\"x-template\">" + markdown.toHTML(html) + "</script>";
	
	$(html).appendTo(this.body);
	this.templates[passage.id] = templateName;
}