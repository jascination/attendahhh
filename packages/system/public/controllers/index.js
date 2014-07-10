'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global',
    function($scope, Global) {
        $scope.global = Global;
    }
]).controller('list', ['$scope', '$http', 'Global',
    function($scope, $http, Global) {
        var sessionObj = {
            name: 'untitled',
            attendees: []
        };

        /*
        $http({
            url: '/saveTableData/upsert',
            method: "POST",
            data: obj

        }).success(function(data, status, headers, config) {
            console.log('in success function')
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log('in errorfunction')
            $scope.status = status;
        });
*/
        $scope.global = Global;
        $scope.selectedCols = [];
        $scope.filtered = [];
        $scope.step = 1;

        $scope.nameIt = function() {
            sessionObj.name = $scope.nameInput;
            $scope.loading = true;

            $http({
                url: '/saveTableData/new',
                method: "POST",
                data: sessionObj

            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.step++;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                console.log('in errorfunction');
                $scope.duplicateName = true;
            });

        }

        $scope.notSorted = function(obj) {
            obj = angular.copy(obj);

            if (!obj) {
                return [];
            }

            return Object.keys(obj);
        }

        $scope.selectBtn = {};

        $scope.convert = function() {

            $scope.fullData = JSON.parse($scope.dataIn);
            $scope.newData = $scope.fullData[0];
            for (var key in $scope.newData) {
                $scope.selectBtn[key] = '';
            }


            $scope.step++;

        }

        $scope.selectColumns = function(col) {
            console.log(col);
            var index = $scope.selectedCols.indexOf(col);

            if (index > -1) {
                $scope.selectedCols.splice(index, 1);
                $scope.selectBtn[col] = '';
            } else {
                $scope.selectedCols.push(col);
                $scope.selectBtn[col] = 'selected';
            }


        }



        $scope.startItUp = function() {

            var full = $scope.fullData;
            var cols = $scope.selectedCols;
            if (!cols.length) {
                alert("you've got to choose at least one column");
            } else {

                for (var i = 0; i < full.length; i++) {
                    var tempObj = {
                        attended: 0,
                        attendClass: 'btn-default'
                    };

                    for (var key in full[i]) {
                        for (var x = 0; x < cols.length; x++) {
                            if (key === cols[x]) {
                                tempObj[key] = full[i][key];
                            }
                        }
                    }
                    $scope.filtered.push(tempObj);

                    console.log("Pushed to Filtered");

                    if (i === full.length - 1) {
                        console.log("Ok here's filetered");
                        console.log($scope.filtered);
                        $scope.filterShow = true;
                    }
                }
            }

            var saveToDB = setInterval(savingData, 60000); // Save data every minute

            $scope.step++;
        }

        $scope.attend = function(index) {

            if ($scope.filtered[index].attended === 1) {
                $scope.filtered[index].attended = 0;
                $scope.filtered[index].attendClass = 'btn-default';
            } else if ($scope.filtered[index].attended === 0) {
                $scope.filtered[index].attended = 1;
                $scope.filtered[index].attendClass = 'btn-success';
            }
        }

        var savingData = function() {

            sessionObj.attendees = $scope.filtered;
            $scope.updating = true;


            $http({
                url: '/saveTableData/upsert',
                method: "POST",
                data: sessionObj

            }).success(function(data, status, headers, config) {
                $scope.updating = false;


            }).error(function(data, status, headers, config) {
                $scope.updating = false;
                console.log('Error upserting');

            });
        }




    }
]);