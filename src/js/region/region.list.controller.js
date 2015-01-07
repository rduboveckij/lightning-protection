(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.constant',
            'lightning.protection.repository.local-storage',
            'lightning.protection.region.simple-data',
            'lightning.protection.service.model'
        ])
        .controller('RegionListCtrl', RegionListCtrl);

    RegionListCtrl.$inject = [
        '$scope',
        '$location',
        'LocalStorage',
        'ModelFactory',
        'SimpleRegionData'
    ];

    function RegionListCtrl($scope, $location, LocalStorage, ModelFactory, SimpleRegionData) {
        $scope.regions = LocalStorage.regions;

        $scope.createRegion = createRegion;
        $scope.editRegion = editRegion;
        $scope.removeRegion = removeRegion;
        $scope.setSimpleData = setSimpleData;

        function createRegion() {
            var region = ModelFactory.emptyRegion();
            $scope.regions.push(region);
            $scope.editRegion(region);
        }

        function editRegion(region) {
            $location.path('/regions/' + region.id);
        }

        function removeRegion(region) {
            LocalStorage.regions = $scope.regions = _.without($scope.regions, region);
        }

        function setSimpleData() {
            LocalStorage.regions = $scope.regions = $scope.regions.concat(SimpleRegionData.getRegions());
        }
    }

})(angular, _, 'lightning.protection.region.list');