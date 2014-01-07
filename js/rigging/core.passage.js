Rigging.core.passage = function(app, id, title, text) {
	this.id = id;
	this.app = app;
	this.text = text;
	this.title = title;

	this.tokens = app.parser.tokenise(this);
	this.registry = new Rigging.core.registry();

	this.tokens.forEach(function(t) {
		t.init(this, app);
	}.bind(this));
}