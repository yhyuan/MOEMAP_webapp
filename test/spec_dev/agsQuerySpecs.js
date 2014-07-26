/* global describe, it, expect */
var agsQuery = require('../../app/scripts/agsQuery');

(function () {
    'use strict';

    describe('agsQuery', function () {
	    describe('agsQuery can query an ArcGIS Server layer', function () {
	        this.timeout(150000);
	        it('should query the Geographic Township layer', function (done) {
	            var queryParams = {
					mapService: 'http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer',
					layerID: 0,
					returnGeometry: true,
					where: 'OFFICIAL_NAME_UPPER = \'ABINGER\'',
					outFields: ['SHAPE_Area', 'CENX', 'CENY']
				};
				var queryPromise = agsQuery.query(queryParams);
				queryPromise.done(function (fset) {
					expect(fset.features).to.have.length(1);
					done();
				});
	        });
	        it('should query the Geographic Township layer with a polygon', function (done) {
	            var queryParams = {
					mapService: 'http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer',
					layerID: 0,
					returnGeometry: true,
					geometry: [{lat: 45.011,lng: -77.203},{lat: 45.003,lng: -77.17},{lat: 44.967,lng: -77.194}],
					outFields: ['SHAPE_Area', 'CENX', 'CENY', 'OFFICIAL_NAME_UPPER']
				};
				var queryPromise = agsQuery.query(queryParams);
				queryPromise.done(function (fset) {
					expect(fset.features[0].attributes.OFFICIAL_NAME_UPPER).to.equal('ABINGER');
					expect(fset.features).to.have.length(1);
					done();
				});
	        });
	        it('should query the Geographic Township layer with a polygon', function (done) {
			var geocodeParams = {address: 'Abinger TWP'};
			var geocodePromise = geocoder.geocode(geocodeParams);
			geocodePromise.then(function() {
				if(result.status === 'OK'){
					var queryParamsList = [{
						mapService: 'http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer',
						layerID: 0,
						returnGeometry: true,
						geometry: Util.computerCircle(result.latlng, 100),
						outFields: ['SHAPE_Area', 'CENX', 'CENY', 'OFFICIAL_NAME_UPPER']
					},{
						mapService: 'http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer',
						layerID: 1,
						returnGeometry: true,
						geometry: Util.computerCircle(result.latlng, 100),
						outFields: ['SHAPE_Area', 'CENX', 'CENY', 'GEOG_TWP', 'LOT_NUM', 'CONCESSION']
					}];
					var promises = _.map(queryParamsList, function(queryParams) {
						return agsQuery.query(queryParams);
					});
					$.when.apply($, promises).then(function() {
						expect(arguments[0].features[0].attributes.OFFICIAL_NAME_UPPER).to.equal('ABINGER');
						expect(arguments[1].features[0].attributes.GEOG_TWP).to.equal('ABINGER');
					});
				} else {
					return result;
				}
			});	        	
	        });
	    });
    });
})();
