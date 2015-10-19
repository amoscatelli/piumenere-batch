'use strict';

angular.module('jberetUI.jobs',
    ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('jobs', {
            url: '/jobs',
            templateUrl: 'jobs/jobs.html',
            controller: 'JobsCtrl'
        });
    }])

    .controller('JobsCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.alerts = [];
        $scope.gridOptions = {
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'jobs.csv',

            enableFiltering: true,
            showGridFooter: true,
            minRowsToShow: 8,
            columnDefs: [
                {name: 'jobName'},
                {name: 'numberOfJobInstances', type: 'number'},
                {name: 'numberOfRunningJobExecutions', type: 'number'}
            ]
        };

        $http.get('http://localhost:8080/restAPI/api/jobs/').then(function (responseData) {
            $scope.gridOptions.data = responseData.data;
        }, function (responseData) {
            console.log(responseData);
        });


        $scope.startJob = function () {
            $scope.alerts.length = 0; //clear alerts
            if ($scope.jobName) {
                var jobParams = jberetui.parseJobParameters($scope.jobParameters);
                $http.post('http://localhost:8080/restAPI/api/jobs/' + $scope.jobName + '/start', jobParams).then(function (responseData) {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Started job: ' + $scope.jobName +
                        (jobParams == null ? '.' : ', with parameters: ' + JSON.stringify(jobParams))
                    });
                    $scope.jobName = '';
                    $scope.jobParameters = '';
                }, function (responseData) {
                    console.log(responseData);
                    $scope.alerts.push({type: 'danger', msg: 'Failed to start job: ' + $scope.jobName});
                    $scope.jobName = '';
                    $scope.jobParameters = '';
                });
            } else {
                $scope.alerts.push({type: 'danger', msg: 'Enter a valid job XML name'});
            }
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    }]);
