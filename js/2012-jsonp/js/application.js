(function () {
//private
    var service = null,
        ui = {
            countriesSelector: null,
            ratesList: null,
            countrySelectButton: null
        },

        countriesColl = [],
        ratesColl = [];

    var initialize = function () {
        for (var method in publicMethods) {
            this[method] = publicMethods[method];
        }
    };

    var prepareCountryRatesModelData = function (model) {
        var values = model.value[0], // ToDo: maybe an error in JSON... structure is different from XML
            i, iLen = values.length,
            value,
            res = {
                countryName: model.key.name,
                values: {}
            };

        for (i = 0; i < iLen; i++) {
            value = values[i];

            res.values[value.type] || (res.values[value.type] = []);

            res.values[value.type].push({
                code: value.areaCode + (value.phonePart ? value.phonePart : ''),
                rate: Number(value.rate).toFixed(2)
            });
        }

        return res;
    };

//ui methods
    var onCountrySelect = function (e) {
        this.loadCountryData(ui.countriesSelector.value, function () {
            this.renderCountry();
        }, this);
    };

    var enableControlls = function () {
        ui.countriesSelector.removeAttribute('disabled');
        ui.countrySelectButton.removeAttribute('disabled');
    };

    var disableControlls = function () {
        ui.countriesSelector.setAttribute('disabled', 'disabled');
        ui.countrySelectButton.setAttribute('disabled', 'disabled');
    }

    var showCountriesLoading = function () {
        ui.countriesSelector.innerHTML = "<option>Please wait ...</option>";
    }

    var emptyCountrilesList = function () {
        ui.countriesSelector.innerHTML = '';
    }

    var showRatesLoading = function () {
        ui.ratesList.innerHTML = 'Loading ...';
    }

    var emptyRatesList = function () {
        ui.ratesList.innerHTML = '';
    }

//public
    var publicMethods = {
        setService: function (value) {
            service = value;
        },

        loadCountries: function (callback, context) {
            context || (context = this);

            disableControlls();

            if (service == null) {
                return;
            }

            showCountriesLoading();

            service.getData('getCountries', 'json', false, function (rData) {
                countriesColl = rData.result;

                enableControlls();
                emptyCountrilesList();

                callback && callback.apply(context);
            }, function (error) {
                emptyCountrilesList();

                alert('Service is not avaliable!');
            }, this);
        },

        renderCountries: function () {
            var opt = '<option value="#key#">#val#</option>',
                opts = '',
                i, iLen = countriesColl.length,
                countryMdl;

            for (i = 0; i < iLen; i++) {
                countryMdl = countriesColl[i];
                opts += opt.replace('#key#', countryMdl.id).replace('#val#', countryMdl.name);
            }

            //removed due to IE bugs
            //ui.countriesSelector.innerHTML = opts;

            var selectorHTML = ui.countriesSelector.outerHTML;
            ui.countriesSelector.outerHTML = selectorHTML.replace(/<\/select>/i, opts + '</select>');

            //reset to newly created element
            ui.countriesSelector = utils.getEl(ui.countriesSelector.id);
        },

        loadCountryData: function (countryId, callback, context) {
            context || (context = this);

            disableControlls();

            if (service == null) {
                return;
            }

            showRatesLoading();

            var params = '&param[internationalRatesRequest][brandId]=1210' +
                '&param[internationalRatesRequest][countryId]=' + countryId +
                '&param[internationalRatesRequest][tierId]=3311';

            service.getData('getInternationalRates', 'json', params, function (rData) {
                ratesColl = rData.rates;

                enableControlls();
                emptyRatesList();

                callback && callback.apply(context);
            }, function (error) {
                enableControlls();
                emptyRatesList();

                alert('Data is not avaliable for this country');
            }, this);
        },

        renderCountry: function () {
            var tableHeaders = [
                    'Country',
                    'Type',
                    'Code',
                    'Rate per minute'
                ],
                cell = '<span class="table-cell">#value#</span>',
                header = '<span class="table-header-cell">#value#</span>',
                i, iLen = tableHeaders.length,
                j, jLen,
                tmp = '',
                countryRates,
                rateType,
                rateValue,
                firstCountryRate;

            for (i = 0; i < iLen; i++) {
                tmp += header.replace('#value#', tableHeaders[i]);
            }
            tmp += '<br class="table-row-separator"/>';

            iLen = ratesColl.length;
            for (i = 0; i < iLen; i++) {
                countryRates = prepareCountryRatesModelData(ratesColl[i]);

                firstCountryRate = true;
                for (rateType in countryRates.values) {
                    jLen = countryRates.values[rateType].length;
                    for (j = 0; j < jLen; j++) {
                        rateValue = countryRates.values[rateType][i];

                        tmp += cell.replace('#value#', firstCountryRate ? countryRates.countryName : '&nbsp;');
                        tmp += cell.replace('#value#', j == 0 ? rateType : '&nbsp;');
                        tmp += cell.replace('#value#', rateValue.code);
                        tmp += cell.replace('#value#', '$ ' + rateValue.rate);

                        tmp += '<br class="table-row-separator"/>';
                    }

                    firstCountryRate && (firstCountryRate = false);
                }
            }

            ui.ratesList.innerHTML = tmp;
        }
    };

    return function (options) {
        options || (options = {});

        initialize.apply(this);

        ui.countriesSelector = utils.getEl(options.countriesSelectorEId);
        ui.ratesList = utils.getEl(options.ratesListEId);
        ui.countrySelectButton = utils.getEl(options.countrySelectButtonEId);

        utils.on(ui.countrySelectButton, 'click', utils.bind(this, onCountrySelect));
    }
})();