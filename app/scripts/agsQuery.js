var query = function (queryParams) {
	var dfd = new $.Deferred();
	setTimeout(function() {
		dfd.resolve(["apple"]);
	}, 1);
	return dfd.promise();
}
var api = {
	query: query
}

module.exports = api;