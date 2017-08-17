utils.onDOMReady(function () {
    var failHandler = function (error) {
        alert("Can't include " + error.file);
    };

    utils.require('application.js', function (Application) {
        var application = new Application({
            countriesSelectorEId: 'c-countries-selector',
            ratesListEId: 'c-rates-list',
            countrySelectButtonEId: 'e-country-select'
        });

        utils.require('service.js', function (Sevice) {
            application.setService(new Sevice({
                api: 'http://localhost/api/index.php'
            }));

            application.loadCountries(function () {
                application.renderCountries();
            });
        }, failHandler);
    }, failHandler, this);
});