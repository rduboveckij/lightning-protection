(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.service.math'
        ])
        .factory('ModelFactory', ModelFactory);

    ModelFactory.$inject = [
        'BaseMath'
    ];

    function ModelFactory(BaseMath) {
        return {
            emptyRegion: emptyRegion,
            emptyPoint: emptyPoint,
            emptyProtector: emptyProtector,
            emptyObject: emptyObject
        };

        function emptyRegion(name, size, reliability, grounds, objects, protectors) {
            return {
                id: BaseMath.uuid2(),
                name: name || "",
                size: size || 1000,
                reliability: reliability || 0.9,
                grounds: grounds || [],
                objects: objects || [],
                protectors: protectors || [],
                created: Date.now()
            }
        }

        function emptyPoint(x, y, z) {
            return {id: BaseMath.uuid2(), x: x || 0, y: y || 0, z: z || 1, created: Date.now() + _.uniqueId()}
        }

        function emptyProtector(name, point) {
            return {id: BaseMath.uuid2(), name: name || "", point: point, created: Date.now() + _.uniqueId()};
        }

        function emptyObject(name, points) {
            return {id: BaseMath.uuid2(), name: name || "", points: points || [], created: Date.now() + _.uniqueId()};
        }
    }

})(angular, _, 'lightning.protection.service.model');