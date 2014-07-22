/* global describe, it */
var geocoder = require("../../app/scripts/geocoder");

(function () {
    'use strict';

    describe('Geocoder', function () {
        describe('Geocoder can parse a string containing decimal latitude and longitude in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43.71702, -79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "-79.54158, 43.71702"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with positive longitude', function () {
				geocoder.geocode({originalAddress: "43.71702, 79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
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
				geocoder.geocode({originalAddress: "43.71702, -79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "-79.54158, 43.71702"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with positive longitude', function () {
				geocoder.geocode({originalAddress: "43.71702, 79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "43.19040, -77.57275"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });
        });
        describe('Geocoder can parse a string containing latitude and longitude using DMS symbols in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43.71702, -79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "-79.54158, 43.71702"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with positive longitude', function () {
				geocoder.geocode({originalAddress: "43.71702, 79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "43.19040, -77.57275"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });
        });
       describe('Geocoder can parse a string containing UTM coordinates in Ontario', function () {
            it('should parse the latitude and longitude in Ontario', function () {
				geocoder.geocode({originalAddress: "43.71702, -79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with revese order', function () {
				geocoder.geocode({originalAddress: "-79.54158, 43.71702"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should parse the latitude and longitude in Ontario with positive longitude', function () {
				geocoder.geocode({originalAddress: "43.71702, 79.54158"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 43.71702)).to.be.below(0.0001);
					expect(Math.abs(result.latlng.lng - (-79.54158))).to.be.below(0.0001);
				});
            });
            it('should not parse the latitude and longitude outside Ontario', function () {
				geocoder.geocode({originalAddress: "43.19040, -77.57275"}, function (result, status) {
					expect(status).to.equal("Error");
				});
            });            
        });
    });

})();
