var utils = {
	require: null,

	ajax: null,

	bind: function bind(context, fn) {
		return function () {
			return fn.apply(context, arguments);
		};
	},

	getEl: function(id) {
		return document.getElementById(id);
	},

	on: function(el, event, handler) {
		el['on'+event] = handler;
	},

	onDOMReady: function(callback) {
		var checkContent = function() {
			if(document.body && document.body.lastChild){
				callback();
			} else {
				return setTimeout(checkContent, 0);
			}
		}

		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", callback, false);
		} else {
			checkContent();
		}
	}
};

utils.ajax = (function() {
	var Ajax = (function () {
			var createRequest = function () {
				var xhr = false;

				if(XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (ActiveXObject) {
					try {
						xhr = new ActiveXObject('Msxml2.XMLHTTP');
					} catch (e){}

					try {
						xhr = new ActiveXObject('Microsoft.XMLHTTP');
					} catch (e){}
				}

				return xhr;
			};

			var publicMethods = {
				getData: function(url, params, callback, fail) {
					params || (params = void(0));

					var xhr = createRequest();
					if (xhr) {
						xhr.open("POST", url, false);
						xhr.send(params);
						if (xhr.status == 200) {
							callback && callback(xhr.responseText);
						} else {
							fail?fail(xhr.statusText):alert("error: " + xhr.statusText);
						}
					} else {
						var err = 'no Ajax support';
						fail?fail(err):alert("error: " + err);
					}

					return xhr;
				}
			}

			return function() {
				for(var method in publicMethods) {
					this[method] = publicMethods[method];
				}
			}
		})();

	return new Ajax();
})();

utils.require = function (file, callback, fail, context) {
	context || (context = this);

	utils.ajax.getData('/js/'+file, false, function(data) {
		var ref = eval(data);
		callback && callback.call(context, ref);
	},
	function(error) {
		fail && fail.call(context, {
			message: error,
			file: file
		});
	});
}