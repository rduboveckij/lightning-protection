(function (angular, _, name) {
    "use strict";

    angular.module(name, [
        'ui.bootstrap',
        'ngRoute',
        'angular-lodash',

        'lightning.protection.region.list',
        'lightning.protection.region.detail'
    ]);

    angular
        .module(name)
        .constant('NAVS', {
            LIST: {
                url: '/',
                name: 'Список підстанцій',
                templateUrl: 'src/page/region/list.html',
                controller: 'RegionListCtrl',
                order: 1
            },
            DETAIL: {
                url: '/regions/:id',
                name: 'Нова підстанція',
                templateUrl: 'src/page/region/detail.html',
                controller: 'RegionDetailCtrl',
                order: 2
            },
            DOC: {url: '/doc', name: 'Документація', templateUrl: 'src/page/doc.html', order: 3},
            ABOUT: {url: '/about', name: 'Про програму', templateUrl: 'src/page/about.html', order: 4}
        });

    angular
        .module(name)
        .config(ConfigRoute);

    ConfigRoute.$inject = [
        '$routeProvider',
        'NAVS'
    ];

    function ConfigRoute($routeProvider, NAVS) {
        $routeProvider
            .when(NAVS.LIST.url, _.pick(NAVS.LIST, 'templateUrl', 'controller'))
            .when(NAVS.DETAIL.url, _.pick(NAVS.DETAIL, 'templateUrl', 'controller'))
            .when(NAVS.DOC.url, _.pick(NAVS.DOC, 'templateUrl', 'controller'))
            .when(NAVS.ABOUT.url, _.pick(NAVS.ABOUT, 'templateUrl', 'controller'))
            .otherwise({redirectTo: '/'});
    }

    angular
        .module(name)
        .run(Nav);

    Nav.$inject = [
        '$rootScope',
        '$route',
        'NAVS'
    ];

    function Nav($rootScope, $route, NAVS) {
        $rootScope.navs = _.values(_.pick(NAVS, 'LIST', 'DOC', 'ABOUT'));

        $rootScope.isActive = isActive;
        $rootScope.addDetailToNav = addDetailToNav;
        $rootScope.removeDetailFromNav = removeDetailFromNav;

        function isActive(nav) {
            return _.has($route.current, 'loadedTemplateUrl') && $route.current.loadedTemplateUrl === nav.templateUrl
        }

        var detail;
        function addDetailToNav (id, name) {
            detail = _.clone(NAVS.DETAIL);
            detail.url = detail.url.replace(':id', id);
            detail.name = name;
            $rootScope.navs.push(detail);
        }

        function removeDetailFromNav () {
            $rootScope.navs = _.without($rootScope.navs, detail);
        }
    }

    _.mixin({
        manyToMany: manyToMany,
        flatMap: flatMap,
        defaultEmpty: defaultEmpty,
        lessThan: lessThan
    });

    function manyToMany(array) {
        return _.flatten(_.map(array, function (seek) {
            return _.map(_.without(array, seek), function (item) {
                return {key: seek, value: item};
            });
        }));
    }

    function flatMap(array, func) {
        return _.flatten(_.map(array, func));
    }

    function defaultEmpty(val, defaultValue) {
        return _.isEmpty(val) ? defaultValue : val;
    }

    function lessThan(less) {
        return function (val) {
            return val < less;
        };
    }

})(angular, _, 'lightning.protection');