(function () {
//private
    var api = 'http://test.ru',
        dataTagCnt = 0,
        head = document.getElementsByTagName("head").item(0),
        done = false;

    var prepareJSONP = function (url) {
        var script = document.createElement("script"),
            processFail = function () {
                window.processJSONPData({
                    status: {
                        success: false,
                        message: '',
                        type: 'Not found',
                        code: 404
                    }
                });
            };

        script.type = "text/javascript";
        script.src = url;
        script.id = 'jsonp-data-' + dataTagCnt++;

        //for IE
        script.onreadystatechange = function () {
            if (this.readyState == "loaded" || this.readyState == "complete") {
                script.onreadystatechange = null;
                script.onload = null;
                script.onerror = null;

                head.removeChild(script);

                if (!done) {
                    processFail();
                }
            }
        };

        //for others
        script.onload = function () {
            head.removeChild(script);
        };

        script.onerror = function () {
            head.removeChild(script);

            processFail();
        }

        head.appendChild(script);
        return script;
    };

    var initialize = function () {
        for (var method in publicMethods) {
            this[method] = publicMethods[method];
        }
    }

//public
    var publicMethods = {
        getData: function (cmd, typeResponse, params, callback, fail, context) {
            context || (context = this);
            params || (params = '');

            done = false;

            prepareJSONP(api + '?' + 'cmd=' + cmd +
                '&typeResponse=' + typeResponse +
                params +
                '&callback=processJSONPData');

            window.processJSONPData = utils.bind(this, function (data) {
                done = true;

                if (data.status.success) {
                    callback.call(context, data);
                } else {
                    fail.call(context, {
                        message: data.status.message,
                        type: data.status.type,
                        code: data.status.code
                    });
                }

                //for IE
                window.processJSONPData = void(0);
                try {
                    delete window.processJSONPData;
                } catch (e) {
                }

            });
        }
    };

    return function (options) {
        options || (options = {});

        initialize.apply(this);

        api = options.api;
    };
})();