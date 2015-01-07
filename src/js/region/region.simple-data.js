(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.service.model'
        ])
        .factory('SimpleRegionData', SimpleRegionData);

    SimpleRegionData.$inject = [
        'ModelFactory'
    ];

    function SimpleRegionData(ModelFactory) {
        return {
            getRegions: _.constant([firstOne(), secondOne()])
        };

        function firstOne() {
            var region = ModelFactory.emptyRegion('ПС 110/35/10 кв Шевченківська', 108, 0.99);
            region.grounds.push(ModelFactory.emptyPoint(25, 30, 1));
            region.grounds.push(ModelFactory.emptyPoint(25, 65, 1));
            region.grounds.push(ModelFactory.emptyPoint(85, 65, 1));
            region.grounds.push(ModelFactory.emptyPoint(85, 30, 1));

            region.objects.push(ModelFactory.emptyObject('опори ЛЕП', [
                ModelFactory.emptyPoint(2, 5, 16),
                ModelFactory.emptyPoint(2, 32, 16),
                ModelFactory.emptyPoint(5, 32, 16),
                ModelFactory.emptyPoint(5, 5, 16)
            ]));
            region.objects.push(ModelFactory.emptyObject('ВЛ', [
                ModelFactory.emptyPoint(6, 8, 7),
                ModelFactory.emptyPoint(6, 29, 7),
                ModelFactory.emptyPoint(26, 29, 7),
                ModelFactory.emptyPoint(26, 8, 7)
            ]));
            region.objects.push(ModelFactory.emptyObject('Т1', [
                ModelFactory.emptyPoint(26, 2, 5),
                ModelFactory.emptyPoint(26, 17, 5),
                ModelFactory.emptyPoint(35, 17, 5),
                ModelFactory.emptyPoint(35, 2, 5)
            ]));
            region.objects.push(ModelFactory.emptyObject('Т2', [
                ModelFactory.emptyPoint(38, 24, 5),
                ModelFactory.emptyPoint(38, 33, 5),
                ModelFactory.emptyPoint(45, 33, 5),
                ModelFactory.emptyPoint(45, 24, 5)
            ]));
            region.objects.push(ModelFactory.emptyObject('ТО', [
                ModelFactory.emptyPoint(35, 7, 6),
                ModelFactory.emptyPoint(35, 24, 6),
                ModelFactory.emptyPoint(45, 24, 6),
                ModelFactory.emptyPoint(45, 29, 6),
                ModelFactory.emptyPoint(57, 29, 6),
                ModelFactory.emptyPoint(57, 7, 6)
            ]));

            region.protectors.push(ModelFactory.emptyProtector("М1", ModelFactory.emptyPoint(17, 57, 30)));
            region.protectors.push(ModelFactory.emptyProtector("М2", ModelFactory.emptyPoint(89, 40, 30)));
            region.protectors.push(ModelFactory.emptyProtector("М3", ModelFactory.emptyPoint(28, 36, 25)));
            region.protectors.push(ModelFactory.emptyProtector("М4", ModelFactory.emptyPoint(28, 61, 25)));

            return region;
        }

        function secondOne() {
            var region = ModelFactory.emptyRegion('ПС 110/35/10 кв Дергачі', 150, 0.99);
            region.grounds.push(ModelFactory.emptyPoint(0, 0, 1));
            region.grounds.push(ModelFactory.emptyPoint(0, 100, 1));
            region.grounds.push(ModelFactory.emptyPoint(148, 100, 1));
            region.grounds.push(ModelFactory.emptyPoint(148, 0, 1));

            region.objects.push(ModelFactory.emptyObject('ВРП 35 кВ', [
                ModelFactory.emptyPoint(9, 15, 7.85),
                ModelFactory.emptyPoint(9, 30, 7.85),
                ModelFactory.emptyPoint(50, 30, 7.85),
                ModelFactory.emptyPoint(50, 15, 7.85)
            ]));
            region.objects.push(ModelFactory.emptyObject('ЗРП 10 кВ', [
                ModelFactory.emptyPoint(50, 9, 5),
                ModelFactory.emptyPoint(50, 25, 5),
                ModelFactory.emptyPoint(87, 25, 5),
                ModelFactory.emptyPoint(87, 9, 5)
            ]));
            region.objects.push(ModelFactory.emptyObject('ЗПУ', [
                ModelFactory.emptyPoint(88, 17, 7.85),
                ModelFactory.emptyPoint(88, 29, 7.85),
                ModelFactory.emptyPoint(130, 29, 7.85),
                ModelFactory.emptyPoint(130, 17, 7.85)
            ]));
            region.objects.push(ModelFactory.emptyObject('Т1', [
                ModelFactory.emptyPoint(87, 40, 5),
                ModelFactory.emptyPoint(87, 25, 5),
                ModelFactory.emptyPoint(70, 25, 5),
                ModelFactory.emptyPoint(70, 40, 5)
            ]));
            region.objects.push(ModelFactory.emptyObject('Т2', [
                ModelFactory.emptyPoint(50, 25, 5),
                ModelFactory.emptyPoint(50, 40, 5),
                ModelFactory.emptyPoint(65, 40, 5),
                ModelFactory.emptyPoint(65, 25, 5)
            ]));
            region.objects.push(ModelFactory.emptyObject('ВРП 110 кВ', [
                ModelFactory.emptyPoint(40, 50, 14.5),
                ModelFactory.emptyPoint(40, 95, 14.5),
                ModelFactory.emptyPoint(103, 95, 14.5),
                ModelFactory.emptyPoint(103, 50, 14.5)
            ]));


            region.protectors.push(ModelFactory.emptyProtector("М1", ModelFactory.emptyPoint(96, 92, 19.35)));
            region.protectors.push(ModelFactory.emptyProtector("М2", ModelFactory.emptyPoint(44, 92, 19.35)));
            region.protectors.push(ModelFactory.emptyProtector("М3", ModelFactory.emptyPoint(68, 65, 19.35)));
            region.protectors.push(ModelFactory.emptyProtector("М4", ModelFactory.emptyPoint(115, 33, 38.2)));
            region.protectors.push(ModelFactory.emptyProtector("М4", ModelFactory.emptyPoint(25, 33, 38.2)));

            return region;
        }
    }

})(angular, _, 'lightning.protection.region.simple-data');