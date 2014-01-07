Rigging.core.util = {};
Rigging.core.util.UID = (function() {
	var curr = 0;
	return function() {
		return ++curr;
	}
}());
