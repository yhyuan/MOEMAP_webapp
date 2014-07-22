(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var regIsFloat = /^(-?\d+)(\.\d+)?$/,
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	replaceChar = function (str, charA, charB) {
		var temp = [];
		temp = str.split(charA);
		var result = temp[0];
		if (temp.length >= 2) {
			for (var i = 1; i < temp.length; i++) {
				result = result + charB + temp[i];
			}
		}
		return result;
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */ 
	//http://appdelegateinc.com/blog/2010/05/16/point-in-polygon-checking/
	// Ray Cast Point in Polygon extension for Google Maps GPolygon
	// App Delegate Inc <htttp://appdelegateinc.com> 2010
	validateLatLngInPolygon = function (latlng, poly) {
		var lat = latlng.lat;
		var lng = latlng.lng;

		var numPoints = poly.length;
		var inPoly = false;
		var j = numPoints - 1;
		for (var i = 0; i < numPoints; i++) {
			var vertex1 = poly[i];
			var vertex2 = poly[j];

			if (vertex1.x < lng && vertex2.x >= lng || vertex2.x < lng && vertex1.x >= lng) {
				if (vertex1.y + (lng - vertex1.x) / (vertex2.x - vertex1.x) * (vertex2.y - vertex1.y) < lat) {
					inPoly = !inPoly;
				}
			}

			j = i;
		}
		return inPoly;
	},
	/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	validateUTMInRange = function (utmCoors, UTMRange) {
		var northing = utmCoors.northing;
		var easting = utmCoors.easting;
		return ((easting < UTMRange.maxEasting) && (easting > UTMRange.minEasting) && (northing < UTMRange.maxNorthing) && (northing > UTMRange.minNorthing));
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	convertUTMtoLatLng = function (utmCoors) {
		var zone = utmCoors.zone;
		var north = utmCoors.northing;
		var east = utmCoors.easting;

		var pi = 3.14159265358979; //PI
		var a = 6378137; //equatorial radius for WGS 84
		var k0 = 0.9996; //scale factor
		var e = 0.081819191; //eccentricity
		var e_2 = 0.006694380015894481; //e'2
		//var corrNorth = north; //North Hemishpe
		var estPrime = 500000 - east;
		var arcLength = north / k0;
		var e_4 = e_2 * e_2;
		var e_6 = e_4 * e_2;
		var t1 = Math.sqrt(1 - e_2);
		var e1 = (1 - t1) / (1 + t1);
		var e1_2 = e1 * e1;
		var e1_3 = e1_2 * e1;
		var e1_4 = e1_3 * e1;
		var C1 = 3 * e1 / 2 - 27 * e1_3 / 32;
		var C2 = 21 * e1_2 / 16 - 55 * e1_4 / 32;
		var C3 = 151 * e1_3 / 96;
		var C4 = 1097 * e1_4 / 512;
		var mu = arcLength / (a * (1 - e_2 / 4.0 - 3 * e_4 / 64 - 5 * e_6 / 256));
		var FootprintLat = mu + C1 * Math.sin(2 * mu) + C2 * Math.sin(4 * mu) + C3 * Math.sin(6 * mu) + C4 * Math.sin(8 * mu);
		var FpLatCos = Math.cos(FootprintLat);
		//var C1_an = e_2*FpLatCos*FpLatCos;
		var FpLatTan = Math.tan(FootprintLat);
		var T1 = FpLatTan * FpLatTan;
		var FpLatSin = Math.sin(FootprintLat);
		var FpLatSin_e = e * FpLatSin;
		var t2 = 1 - FpLatSin_e * FpLatSin_e;
		var t3 = Math.sqrt(t2);
		var N1 = a / t3;
		var R1 = a * (1 - e_2) / (t2 * t3);
		var D = estPrime / (N1 * k0);
		var D_2 = D * D;
		var D_4 = D_2 * D_2;
		var D_6 = D_4 * D_2;
		var fact1 = N1 * FpLatTan / R1;
		var fact2 = D_2 / 2;
		var fact3 = (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * e_2) * D_4 / 24;
		var fact4 = (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * e_2 - 3 * C1 * C1) * D_6 / 720;
		var lofact1 = D;
		var lofact2 = (1 + 2 * T1 + C1) * D_2 * D / 6;
		var lofact3 = (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * e_2 + 24 * T1 * T1) * D_4 * D / 120;
		var delta_Long = (lofact1 - lofact2 + lofact3) / FpLatCos;
		var zone_CM = 6 * zone - 183;
		var latitude = 180 * (FootprintLat - fact1 * (fact2 + fact3 + fact4)) / pi;
		var longitude = zone_CM - delta_Long * 180 / pi;
		var res = {
			lat: latitude.toFixed(8),
			lng: longitude.toFixed(8)
		};
		return res;
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	parseLatLngSymbols = function (val, s1, s2, s3) {
		var parseDMS = function (s, unparsed) {
			var res = {
				ParsedNum: 0,
				Unparsed: ""
			};
			if (unparsed.length === 0) {
				return res;
			}
			var arr = unparsed.split(s);
			var result = 0;
			if (arr.length <= 2) {
				if (regIsFloat.test(arr[0])) {
					result = parseFloat(arr[0]);
				}
				if (arr.length === 2) {
					unparsed = arr[1];
				} else {
					unparsed = "";
				}
			}
			res = {
				ParsedNum: result,
				Unparsed: unparsed
			};
			return res;
		};

		var result = 0;
		var parsed = parseDMS(s1, val);
		var deg = parsed.ParsedNum;
		parsed = parseDMS(s2, parsed.Unparsed);
		var min = parsed.ParsedNum;
		parsed = parseDMS(s3, parsed.Unparsed);
		var sec = parsed.ParsedNum;
		if (deg > 0) {
			result = deg + min / 60.0 + sec / 3600.0;
		} else {
			result = deg - min / 60.0 - sec / 3600.0;
		}
		result = Math.abs(result);
		return result;
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
//Private method: parse the input to get Lot, Concession
	processLotCon = function (arr1) {
		if (arr1.length !== 2) {
			return {
				TWP: "",
				Lot: "",
				Con: "",
				isTWPOnly: false,
				success: false
			};
		}
		var TWPname = (arr1[0]).trim().split(/\s+/).join(' '); //replace multiple spaces with one space
		var con = "";
		var lot = "";
		if (((arr1[1]).indexOf("LOT") > 0) && ((arr1[1]).indexOf("CON") > 0)) {
			var arr2 = ((arr1[1]).trim()).split("CON");
			if ((arr2[0]).length === 0) {
				var arr3 = (arr2[1]).split("LOT");
				con = (arr3[0]).trim();
				lot = (arr3[1]).trim();
			} else {
				var arr4 = (arr2[0]).split("LOT");
				con = (arr2[1]).trim();
				lot = (arr4[1]).trim();
			}
		}
		var TWPOnly = false;
		if ((con.length === 0) && (lot.length === 0)) {
			TWPOnly = true;
		}
		return {
			TWP: TWPname,
			Lot: lot,
			Con: con,
			isTWPOnly: TWPOnly,
			success: true
		};
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
//Private method: parse the input to get Township, Lot, Concession by calling processLotCon
	preprocessTWP = function (coors_Up) {
		var res = {
			TWP: "",
			Lot: "",
			Con: "",
			isTWPOnly: false,
			success: false
		};
		if (coors_Up.indexOf(' TWP') > 0) {
			res = processLotCon(coors_Up.split(" TWP"));
		}
		if (!res.success) {
			if (coors_Up.indexOf(' TOWNSHIP') > 0) {
				res = processLotCon(coors_Up.split(" TOWNSHIP"));
			}
		}
		if (!res.success) {
			if (coors_Up.indexOf('CANTON ') === 0) {
				var str = coors_Up.substring(7).trim();
				var lotIndex = str.indexOf(" LOT ");
				var conIndex = str.indexOf(" CON ");
				var index = lotIndex;
				if (conIndex < lotIndex) {
					index = conIndex;
				}
				var parsedList = [];
				if (index === -1) {
					parsedList.push(str);
					parsedList.push("");
				} else {
					parsedList.push(str.substring(0, index));
					parsedList.push(str.substring(index));
				}
				res = processLotCon(parsedList);
			}
		}
		return res;
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	getTWPinfo = function (originalAddress) {
		return preprocessTWP(replaceChar(originalAddress, ',', ' ').trim().split(/\s+/).join(' ').toUpperCase()); 
	},
/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
	geocodeByQuery = function (params, settings, callback) {
		var layer = new gmaps.ags.Layer(settings.mapService + "/" + settings.layerID);
		var outFields = settings.fieldsInInfoWindow;
		outFields.push(settings.latitudeField);
		outFields.push(settings.longitudeField);
		outFields.push(settings.areaField);
		var queryParams = {
			returnGeometry: settings.displayPolygon,
			where: settings.searchCondition,
			outFields: outFields
		};
		layer.query(queryParams, function (fset) {
			var size = 0;
			if(fset){
				var features = fset.features;
				size = features.length;				
				if (size > 0) {
					var attrs = features[0].attributes;
					var result = {
						address: params.originalAddress,
						geocodedAddress: settings.getInfoWindow(attrs)
					};
					if(queryParams.returnGeometry) {
						result.geometry = _.map(features, function(feature) {
							return feature.geometry;
						});
					}
					if (size === 1) {
						result.latlng = {
							lat: attrs[settings.latitudeField],
							lng: attrs[settings.longitudeField]
						};
					} else {
						var totalArea = _.reduce(features, function(total_area, feature) {
							return feature.attributes[settings.areaField] + total_area;
						}, 0);
						var totalLat = _.reduce(features, function(total_lat, feature) {
							return feature.attributes[settings.latitudeField]* feature.attributes[settings.areaField] + total_lat;
						}, 0);
						var totalLng = _.reduce(features, function(total_lng, feature) {
							return feature.attributes[settings.longitudeField]* feature.attributes[settings.areaField] + total_lng;
						}, 0);
						result.latlng = {
							lat: totalLat/totalArea,
							lng: totalLng/totalArea
						};
					}
					callback(result, "OK");
				}else{
					callback({}, "Error");
				}
			}else{
				callback({}, "Error");
			}
		}); 
	},
	geocoderList = {
		"LatLngInDecimalDegree" : {
			"match": function (params) {
				var coorsArray = replaceChar(params.originalAddress, ',', ' ').trim().split(/\s+/);
				if ((coorsArray.length === 2) && regIsFloat.test(coorsArray[0]) && regIsFloat.test(coorsArray[1])) {
					var v0 = Math.abs(parseFloat(coorsArray[0]));
					var v1 = Math.abs(parseFloat(coorsArray[1]));
					this.latlng = params.generateLatLngFromFloats(v0, v1);
					return validateLatLngInPolygon(this.latlng, params.regionBoundary);
				}
				return false;
			}, 
			"geocode": function (params, callback) {
				callback({
					latlng: this.latlng,
					address: params.originalAddress
				}, "OK");
			}
		},
		"LatLngInSymbols" : {
			"match": function (params) {
				var degreeSym = String.fromCharCode(176);
				var coorsArray = replaceChar(params.originalAddress, ',', ' ').trim().split(/\s+/);
				if ((coorsArray.length === 2) && ((coorsArray[0]).indexOf(degreeSym) > 0) && ((coorsArray[1]).indexOf(degreeSym) > 0)) {
					var v0 = parseLatLngSymbols(coorsArray[0], degreeSym, "'", "\"");
					var v1 = parseLatLngSymbols(coorsArray[1], degreeSym, "'", "\"");
					this.latlng = params.generateLatLngFromFloats(v0, v1);
					return validateLatLngInPolygon(this.latlng, params.regionBoundary);
				}
				return false;
			}, 
			"geocode": function (params, callback) {
				callback({
					latlng: this.latlng,
					address: params.originalAddress
				}, "OK");
			}
		},
		"LatLngInDMSSymbols" : {
			"match": function (params) {
				var coorsArray = replaceChar(params.originalAddress, ',', ' ').trim().split(/\s+/);
				if (coorsArray.length === 2) {
					var str1 = (coorsArray[0]).toUpperCase();
					var str2 = (coorsArray[1]).toUpperCase();
					var validateDMSFormat = function (str) {
						for (var i = 0; i <= 9; i++) {
							if (str.indexOf(i + "D") > 0) {
								return true;
							}
						}
						return false;
					};
					if (validateDMSFormat(str1) && validateDMSFormat (str2)) {
						var v0 = parseLatLngSymbols(str1, "D", "M", "S");
						var v1 = parseLatLngSymbols(str2, "D", "M", "S");
						this.latlng = params.generateLatLngFromFloats(v0, v1);
						return validateLatLngInPolygon(this.latlng, params.regionBoundary);
					}
				}
				return false;
			}, 
			"geocode": function (params, callback) {
				callback({
					latlng: this.latlng,
					address: params.originalAddress
				}, "OK");
			}
		},
		"UTMInDefaultZone" : {
			"match": function (params) {
				var coorsArray = replaceChar(params.originalAddress, ',', ' ').trim().split(/\s+/);
				if ((coorsArray.length === 2) && regIsFloat.test(coorsArray[0]) && regIsFloat.test(coorsArray[1])) {
					var v1 = Math.abs(parseFloat(coorsArray[0]));
					var v2 = Math.abs(parseFloat(coorsArray[1]));
					var utmCoors = {
						easting: Math.min(v1, v2),
						northing: Math.max(v1, v2)
					};
					if (validateUTMInRange(utmCoors, params.UTMRange)) {
						utmCoors.zone = params.defaultUTMZone;
						this.latlng = convertUTMtoLatLng(utmCoors);
						return validateLatLngInPolygon(this.latlng, params.regionBoundary);
					}
				}
				return false;
			}, 
			"geocode": function (params, callback) {
				callback({
					latlng: this.latlng,
					address: params.originalAddress
				}, "OK");
			}
		},
		"UTM" : {
			"match": function (params) {
				var coorsArray = replaceChar(params.originalAddress, ',', ' ').trim().split(/\s+/);
				if (coorsArray.length === 3) {
					var coorsArrayNoComma = _.map(coorsArray, function (item) {
						return item.replace(",", " ").trim();
					});
					if (_.every(coorsArrayNoComma, function(item) {return regIsFloat.test(item);})) {
						var values = _.map(coorsArrayNoComma, function (item) {
							return Math.abs(parseFloat(item));
						}).sort(function (a, b) {
							return a - b;
						});
						var reg_isInteger = /^\d+$/;
						if (reg_isInteger.test((values[0]).toString())) {
							if ((values[0] >= 15) && (values[0] <= 18)) {
								var utmCoors = {
									zone: values[0],
									easting: values[1],
									northing: values[2]
								};
								if (validateUTMInRange(utmCoors, params.UTMRange)) {
									this.latlng = convertUTMtoLatLng(utmCoors);
									return validateLatLngInPolygon(this.latlng, params.regionBoundary);
								}
							}
						}
					}
				}
				return false;
			}, 
			"geocode": function (params, callback) {
				callback({
					latlng: this.latlng,
					address: params.originalAddress
				}, "OK");
			}
		},
		"GeographicTownship" : {
			"match": function (params) {
				var twpInfo = getTWPinfo(params.originalAddress);
				return (twpInfo.success && twpInfo.isTWPOnly);
			},
			"geocode": function (params, callback) {
				var twpInfo = getTWPinfo(params.originalAddress);
				var settings = {
					mapService: "http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer",
					layerID: 0,
					displayPolygon: true,  
					fieldsInInfoWindow: ["OFFICIAL_NAME"], 
					getInfoWindow: function(attributes){
						return "<strong>" + attributes.OFFICIAL_NAME + "</strong>";
					}, 
					latitudeField: "CENY",
					longitudeField: "CENX",
					areaField: "SHAPE_Area",
					searchCondition: "OFFICIAL_NAME_UPPER = '" + twpInfo.TWP + "'"
				};
				geocodeByQuery(params, settings, callback);
			}
		},
		"GeographicTownshipWithLotConcession" : {
			"match": function (params) {
				var twpInfo = getTWPinfo(params.originalAddress);
				return (twpInfo.success && (!twpInfo.isTWPOnly));
			},
			"geocode": function (params, callback) {
				var twpInfo = getTWPinfo(params.originalAddress);
				var settings = { 
					mapService: "http://lrcdrrvsdvap002/ArcGIS/rest/services/Interactive_Map_Public/GeographicTownships/MapServer",
					layerID: 1,
					displayPolygon: true,  
					fieldsInInfoWindow: ["GEOG_TWP", "LOT_NUM", "CONCESSION"], 
					getInfoWindow: function(attributes){
						return "<strong>" + attributes.GEOG_TWP + " " + attributes.LOT_NUM + " " + attributes.CONCESSION + "</strong>";
					}, 
					latitudeField: "CENY",
					longitudeField: "CENX",
					areaField: "SHAPE_Area",
					searchCondition: "GEOG_TWP" + " = '" + twpInfo.TWP + "' AND CONCESSION = 'CON " + twpInfo.Con + "' AND LOT_NUM = 'LOT " + twpInfo.Lot + "'"
				};
				geocodeByQuery(params, settings, callback);
			}
		}
	};


/**
 * Geocode an address string or geocoding Params. If it is an address string, createGeocodeParams is Creates a geocoding Params object using the default setting in Geocoder.
 * called to convert it to geocoding params. 
 *
 * @param {string} d The address to be geocoded.
 * @return {object} An ojbect sendt to geocoder.
 */
function geocode(initParams, callback) {
	var defaultParams = {
		//originalAddress: originalAddress, 
		geocoderList: (!!initParams.geocoderList) ? _.defaults(initParams.geocoderList, geocoderList) : geocoderList, 
		regionBoundary: [{x: -95.29920350, y: 48.77505703},{x: -95.29920350, y: 53.07150598}, 	{x: -89.02502409, y: 56.95876930}, 	{x: -87.42238044, y: 56.34499088}, 	{x: -86.36531760, y: 55.93580527}, 	{x: -84.69447635, y: 55.45842206}, 	{x: -81.89837466, y: 55.35612565}, 	{x: -81.96657226, y: 53.17380238}, 	{x: -80.84131182, y: 52.28723355}, 	{x: -79.98884179, y: 51.80985033}, 	{x: -79.34096457, y: 51.74165273}, 	{x: -79.34096457, y: 47.54750019}, 	{x: -78.55669214, y: 46.49043736}, 	{x: -76.61306048, y: 46.14944935}, 	{x: -75.59009645, y: 45.77436253}, 	{x: -74.12384800, y: 45.91075774}, 	{x: -73.98745279, y: 45.02418891}, 	{x: -75.07861443, y: 44.61500329}, 	{x: -75.86288685, y: 44.03532368}, 	{x: -76.88585089, y: 43.69433566}, 	{x: -79.20, y: 43.450196}, 	{x: -78.62488975, y: 42.94416204}, 	{x: -79.54555738, y: 42.43268002}, 	{x: -81.28459623, y: 42.15988961}, 	{x: -82.54625188, y: 41.58020999}, 	{x: -83.26232670, y: 41.95529681}, 	{x: -83.36462310, y: 42.43268002}, 	{x: -82.61444948, y: 42.73956923}, 	{x: -82.17116506, y: 43.59203926}, 	{x: -82.61444948, y: 45.36517692}, 	{x: -84.08069793, y: 45.91075774}, 	{x: -84.93316796, y: 46.69503016}, 	{x: -88.27485047, y: 48.22947621}, 	{x: -89.33191330, y: 47.78619180}, 	{x: -90.32077854, y: 47.68389540}, 	{x: -92.09391619, y: 47.95668581}, 	{x: -94.07164666, y: 48.33177262}, 	{x: -95.29920350, y: 48.77505703}],
		UTMRange: {
			minEasting: 258030.3,
			maxEasting: 741969.7,
			minNorthing: 4614583.73,
			maxNorthing: 6302884.09
		},
		defaultUTMZone: 17,
		/**
		 * Creates a latlng with two floats. In Ontario, the absolute value of longitude is always larger than the absolute value
		 * of latitude. This knowledge is used to determine which value is latitude and which value is longitude. In other areas, 
		 * this function has to be redefined. 
		 *
		 * @param {float, float} two floats.
		 * @return {object} An ojbect sendt to geocoder.
		 */
		generateLatLngFromFloats: function (v1, v2) {
			var lat = Math.min(v1, v2);
			var lng = -Math.max(v1, v2);
			return {lat: lat, lng: lng};
		}
	};
	var params = _.defaults(initParams, defaultParams);
	/*if (!!initParams.geocoderList) {
		params.geocoderList = params.geocoderList.concat(initParams.geocoderList);
	}*/
	if (!!params.latlng && !!params.latlng.lat && !!params.latlng.lng && !!params.reverseGeocoder) {
		params.reverseGeocoder(params, callback);
	} else {
		var geocoder = _.find(_.values(params.geocoderList), function(geocoder){ 
			return geocoder.match(params);
		});
		if(!!geocoder) {
			geocoder.geocode(params, callback)
		} else {
			callback({}, "Error");
		}
	}
}

var api = {
	geocode: geocode
}

module.exports = api;
},{}],2:[function(require,module,exports){
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
	        
	        it('should not parse the wrong Geographic Township with Lot and Concession in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Apple Township, Lot 1, Con 2"}, function (result, status) {
					expect(status).to.equal("Error");
					done();
				});
	        });
	    });
	    describe('Geocoder can parse a string with geocoder provided by caller', function () {
	    	this.timeout(150000);	    	
	        it('should parse the Geographic Township with Lot and Concession in Ontario', function (done) {
				geocoder.geocode({
					originalAddress: "Dummy address", 
					geocoderList: {
						"DummyGeocoder" : {
							"match": function (params) {
								return params.originalAddress === "Dummy address";
							},
							"geocode": function (params, callback) {
								setTimeout(callback(
									{
										latlng:
											{
												lat: 45.067567,
												lng: -77.16453
											}, 
										status: 
											"OK"
									}), 100);
							}
						}
					}
				}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.067567)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.16453))).to.be.below(0.001);
					done();
				});
	        });
	    });
	    describe('Geocoder can reverse a latitude, longitude to address with a reverse geocoder provided by caller', function () {
	    	this.timeout(150000);	    	
	        it('should parse the Geographic Township with Lot and Concession in Ontario', function (done) {
				geocoder.geocode({originalAddress: "Abinger TWP, Lot 8, Con 14"}, function (result, status) {
					expect(status).to.equal("OK");
					expect(Math.abs(result.latlng.lat - 45.067567)).to.be.below(0.001);
					expect(Math.abs(result.latlng.lng - (-77.16453))).to.be.below(0.001);
					done();
				});
	        });
	    });	    
    });
})();

},{"../../app/scripts/geocoder":1}]},{},[2]);