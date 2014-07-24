/* global describe, it */
var agsQuery = require("../../app/scripts/agsQuery");

(function () {
    'use strict';

    describe('agsQuery', function () {
	    describe('agsQuery can query an ArcGIS Server layer', function () {
	    	this.timeout(150000);
	        it('should query the Geographic Township layer', function (done) {
	        	var queryParams = {
					mapService: "http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer",
					layerID: 0,
					returnGeometry: true,
					where: "OFFICIAL_NAME_UPPER = 'ABINGER'",
					outFields: ["SHAPE_Area", "CENX", "CENY"]
				};
				var queryPromise = agsQuery.query(queryParams);
				queryPromise.done(function (fset) {
					//expect(Math.abs(result.latlng.lat - 45.008284)).to.be.below(0.001);
					//expect(Math.abs(result.latlng.lng - (-77.184177))).to.be.below(0.001);
					expect(fset).to.have.length(1);
					done();
				});
	        });
	    });
    });
})();
