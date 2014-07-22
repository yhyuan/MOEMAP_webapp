/* global describe, it */
var geocoder = require("../../app/scripts/geocoder");

(function () {
    'use strict';

    describe('Geocoder', function () {
        describe('Geocoder can parse a string containing decimal latitude and longitude in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43.71702, -79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "-79.54158, 43.71702"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.001);
				});
            });
            it('should parse the latitude and longitude in Ontario with positive longitude', function () {
				geocoder.geocode({originalAddress: "43.71702, 79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "43.19040, -77.57275"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });
        });
        describe('Geocoder can parse a string containing latitude and longitude using degree, minute, second symbols in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43°42'37.05\", 79°32'28.92\""}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71029)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.541366))).to.be.below(0.001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "79°32'28.92\", 43°42'37.05\""}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71029)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.541366))).to.be.below(0.001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "40°42'37.05\", 79°32'28.92\""}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });
        });
        describe('Geocoder can parse a string containing latitude and longitude using DMS symbols in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43d42m37.05s, 79d32m28.92s"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71029)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.541366))).to.be.below(0.001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "79d32m28.92s, 43d42m37.05s"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71029)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.541366))).to.be.below(0.001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "40d42m37.05s, 79d32m28.92s"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });
        });
       describe('Geocoder can parse a string containing UTM coordinates in Ontario', function () {
            it('should parse the UTM coordinate within default zone: 17 in Ontario', function () {
				geocoder.geocode({originalAddress: "617521.28, 4840730.67"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.710291)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54126))).to.be.below(0.001);
				});
            });
            it('should parse the UTM coordinate with reverse order within default zone: 17 in Ontario', function () {
				geocoder.geocode({originalAddress: "4840730.67, 617521.28"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.710291)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54126))).to.be.below(0.001);
				});
            });
            it('should parse the UTM coordinate in Ontario', function () {
				geocoder.geocode({originalAddress: "17, 4840730.67, 617521.28"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.710291)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.54126))).to.be.below(0.001);
				});
            });
            it('should parse the UTM coordinate in zone 18 in Ontario', function () {
				geocoder.geocode({originalAddress: "18, 517468, 5019950"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.33284)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-74.77707))).to.be.below(0.0001);
				});
            });
            it('should parse the UTM coordinate in zone 15 in Ontario', function () {
				geocoder.geocode({originalAddress: "15, 412541, 5503272"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 49.67563)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-94.21223))).to.be.below(0.0001);
				});
            });
            it('should not parse the UTM coordinate outside Ontario', function () {
				geocoder.geocode({originalAddress: "17, 333050, 4920558"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });            
        });
	    describe('Geocoder can parse a string containing Geographic Township name in Ontario', function () {
	    	this.timeout(150000);

	        it('should parse the Geographic Township in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Abinger TWP"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.008284)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.184177))).to.be.below(0.001);
					expect(result.geometry).to.have.length(1);
					done();
				});
	        });
	        it('should parse the Geographic Township in Ontario', function (done) {
				geocoder.geocode({originalAddress: "ABinger TWP"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.008284)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.184177))).to.be.below(0.001);
					expect(result.geometry).to.have.length(1);
					done();
				});
	        });
	        it('should parse the Geographic Township in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Abinger Township"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.008284)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.184177))).to.be.below(0.001);
					expect(result.geometry).to.have.length(1);
					done();
				});
	        });
	        it('should parse the Geographic Township with multiple polygons in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Gibson Township"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 44.9980573)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.8036325))).to.be.below(0.001);
					expect(result.geometry).to.have.length(11);
					done();
				});
	        });
	        
	        it('should not parse the wrong Geographic Township in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Apple Township"}, function (result, status) {
					expect(status).to.equal("Error");
					done();
				});
	        });
	    });
	    describe('Geocoder can parse a string containing Geographic Township name with Lot and Concession in Ontario', function () {
	    	this.timeout(150000);
	    	
	        it('should parse the Geographic Township with Lot and Concession in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Abinger TWP, Lot 8, Con 14"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.067567)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.16453))).to.be.below(0.001);
					done();
				});
	        });
	        it('should parse the Geographic Township with Concession and Lot in Ontario', function (done) {
				geocoder.geocode({originalAddress: "ABinger TWP, Con 14, Lot 8"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.067567)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.16453))).to.be.below(0.001);
					done();
				});
	        });
	        it('should parse the Geographic Township with Lot and Concession in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Abinger Township, Lot 8, Con 14"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.067567)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.16453))).to.be.below(0.001);
					done();
				});
	        });
	        /*
	        it('should parse the Geographic Township with multiple polygons in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Gibson Township"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 44.9980573)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-79.8036325))).to.be.below(0.001);
					done();
				});
	        });*/
	        
	        it('should not parse the wrong Geographic Township in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Apple Township, Lot 1, Con 2"}, function (result, status) {
					expect(status).to.equal("Error");
					done();
				});
	        });
	    });
    });
})();
