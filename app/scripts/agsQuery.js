/* global _, $ */

var formatTimeString_ = function (time, endTime) {
  var ret = '';
  if (time) {
    ret += (time.getTime() - time.getTimezoneOffset() * 60000);
  }
  if (endTime) {
    ret += ', ' + (endTime.getTime() - endTime.getTimezoneOffset() * 60000);
  }
  return ret;
};

/**
 * get string as rest parameter
 * @param {Object} o
 */
var formatRequestString_ = function (o) {
  var ret;
  if (typeof o === 'object') {
    if (isArray_(o)) {
      ret = [];
      for (var i = 0, I = o.length; i < I; i++) {
        ret.push(formatRequestString_(o[i]));
      }
      return '[' + ret.join(',') + ']';
    } else if (isOverlay_(o)) {
      return fromOverlaysToJSON_(o);
    } else if (o.toJSON) {
      return o.toJSON();
    } else {
      ret = '';
      for (var x in o) {
        if (o.hasOwnProperty(x)) {
          if (ret.length > 0) {
            ret += ', ';
          }
          ret += x + ':' + formatRequestString_(o[x]);
        }
      }
      return '{' + ret + '}';
    }
  }
  return o.toString();
};

/**
 * Format params to URL string
 * @param {Object} params
 */
var formatParams_ = function (params) {
  var query = '';
  if (params) {
    params.f = params.f || 'json';
    for (var x in params) {
      if (params.hasOwnProperty(x) && params[x] !== null && params[x] !== undefined) { // wont sent undefined.
        //jslint complaint about escape cause NN does not support it.
        var val = formatRequestString_(params[x]); 
        query += (query.length > 0?'&':'')+(x + '=' + (escape ? escape(val) : encodeURIComponent(val)));
      }
    }
  }
  return query;
};

var jsonpID_ = 0;
window['ags_jsonp'] = window['ags_jsonp'] || {};
var getJSON_ = function (url, params, callbackName, callbackFn) {
  var sid = 'ags_jsonp_' + (jsonpID_++) + '_' + Math.floor(Math.random() * 1000000);
  var script = null;
  params = params || {};
 // AGS10.1 escapes && so had to take it off.
  params[callbackName || 'callback'] = 'ags_jsonp.' + sid;
  var query = formatParams_(params);
  var head = document.getElementsByTagName("head")[0];
  if (!head) {
    throw new Error("document must have header tag");
  }
  var jsonpcallback = function() {
    if (window['ags_jsonp'][sid]) {
      delete window['ags_jsonp'][sid]; //['ags_jsonp']
    }
    if (script) {
      head.removeChild(script);
    }
    script = null;
    callbackFn.apply(null, arguments);
    /**
     * This event is fired after a REST JSONP response was returned by server.
     * @name Util#jsonpend
     * @param {String} scriptID
     * @event
     */
    //triggerEvent_(Util, 'jsonpend', sid);
  };
  window['ags_jsonp'][sid] = jsonpcallback;
  
  if ((query + url).length < 2000 /*&& !Config.alwaysUseProxy*/) {
    script = document.createElement("script");
    script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + query;
    script.id = sid;
    head.appendChild(script);
  } /*else {
    // check if same host
    var loc = window.location;
    var dom = loc.protocol + '//' + loc.hostname + (!loc.port || loc.port === 80 ? '' : ':' + loc.port + '/');
    var useProxy = true;
    if (url.toLowerCase().indexOf(dom.toLowerCase()) !== -1) {
      useProxy = false;
    }
    if (Config.alwaysUseProxy) {
      useProxy = true;
    }
    if (useProxy && !Config.proxyUrl) {
      throw new Error('No proxyUrl property in Config is defined');
    }
    var xmlhttp = getXmlHttp_();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          eval(xmlhttp.responseText);
        } else {
          throw new Error("Error code " + xmlhttp.status);
        }
      }
    };
    xmlhttp.open('POST', useProxy ? Config.proxyUrl + '?' + url : url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send(query);
  } */
  /**
   * This event is fired before a REST request sent to server.
   * @name Util#jsonpstart
   * @param {String} scriptID
   * @event
   */
  //triggerEvent_(Util, 'jsonpstart', sid);
  return sid;
};
  
var query = function (p) {
	var dfd = new $.Deferred();
  //Layer.prototype.query = function(p, callback, errback) {
    if (!p) {
      return;
    }
    if(!p.hasOwnProperty("mapService") || !p.hasOwnProperty("layerID")) {
		return;
    }
    // handle text, where, relationParam, objectIds, maxAllowableOffset
    var params = _.clone(p);
    var url = params.mapService + "/" + params.layerID;
	delete params.mapService;
	delete params.layerID;
    
    if (p.hasOwnProperty("geometry")) {
      params.geometryType = 'esriGeometryPolygon';
      params.geometry = '{rings:[[' + _.map(p.geometry, function(pt) {
      		return "[" + pt.lng.toFixed(6) + "," + pt.lat.toFixed(6) + "]";
      }).join(',') + ']], spatialReference:{wkid:4326}}';
      params.inSR = 4326;
    } 
    if (p.spatialRelationship) {
      params.spatialRel = p.spatialRelationship;
      delete params.spatialRelationship;
    }
    if (p.outFields && $.isArray(p.outFields)) {
      params.outFields = p.outFields.join(',');
    }
    if (p.objectIds) {
      params.objectIds = p.objectIds.join(',');
    }
    if (p.time) {
      params.time = formatTimeString_(p.time, p.endTime);
    }
    params.outSR = 4326;
    params.returnGeometry = p.returnGeometry === false ? false : true;
    params.returnIdsOnly = p.returnIdsOnly === true ? true : false;
    //console.log(params);
    //delete params.overlayOptions;
    getJSON_(url + '/query', params, '', function(json) {
    	dfd.resolve(json);	
      /*parseFeatures_(json.features, p.overlayOptions);
      callback(json, json.error);
      handleErr_(errback, json);*/
    });
  //};
  	/*
	setTimeout(function() {
		dfd.resolve(["apple"]);
	}, 1); */
	return dfd.promise();
}
var api = {
	query: query
}

module.exports = api;