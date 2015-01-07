(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'ui.bootstrap',
            'lightning.protection.service.model',
            'lightning.protection.repository.local-storage'
        ])
        .factory('PointDialogFactory', PointDialogFactory);

    PointDialogFactory.$inject = [
        '$modal',
        'ModelFactory'
    ];

    function PointDialogFactory($modal, ModelFactory) {
        return {addOrEditPoint: addOrEditPoint};

        function addOrEditPoint(point, maxSize) {
            return $modal.open({
                templateUrl: 'src/dialog/point.html',
                controller: 'PointDialogCtrl',
                size: 'sm',
                resolve: {point: pointResolve, maxSize: maxSizeResolve}
            }).result;

            function pointResolve() {
                return !_.isEmpty(point) ? point : ModelFactory.emptyPoint();
            }

            function maxSizeResolve() {
                return maxSize;
            }
        }
    }

    angular
        .module(name)
        .controller('PointDialogCtrl', PointDialogCtrl);

    PointDialogCtrl.$inject = [
        "$scope",
        "$modalInstance",
        "heightRange",
        "point",
        "maxSize"
    ];

    function PointDialogCtrl($scope, $modalInstance, heightRange, point, maxSize) {
        $scope.maxHeight = heightRange.MAX;
        $scope.point = point;
        $scope.maxSize = maxSize;

        $scope.save = save;
        $scope.cancel = cancel;

        function save() {
            $modalInstance.close($scope.point);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }

    angular
        .module(name)
        .directive('listOfPoint', ListOfPoint);

    function ListOfPoint() {
        return {
            restrict: 'E',
            scope: {
                points: '=',
                create: '=',
                edit: '=',
                remove: '='
            },
            templateUrl: 'src/directive/list-of-point.html'
        };
    }

})(angular, _, 'lightning.protection.point');