(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'ngStorage'
        ])
        .factory('LocalStorage', LocalStorage);

    LocalStorage.$inject = [
        '$localStorage'
    ];

    function LocalStorage($localStorage) {
        return $localStorage.$default({regions: []});
    }

})(angular, _, 'lightning.protection.repository.local-storage');