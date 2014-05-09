var clientModule = angular.module('client', ['ngRoute']);




clientModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/newticket', {
            templateUrl: '/partials/client/newticket.html',
            controller: 'newticketController'
        })
        .when('/viewticket/:hash', {
            templateUrl: '/partials/client/viewticket.html',
            controller: 'viewticketController'
        })
        .when('/viewticket', {
            templateUrl: '/partials/client/viewticket.html',
            controller: 'viewticketController'
        })
        .otherwise({
            redirectTo: '/newticket'
        });
});

clientModule.controller('newticketController', function($scope, $location) {
    $scope.submit = function() {
        socket.emit('setTicket', null, $scope.title, $scope.dept, $scope.body, $scope.priority, $scope.user, $scope.email,
            null, null, null, null, null, null, false);

        $location.path('/viewticket');

    }
});

clientModule.controller('viewticketController', function($scope) {

});

clientModule.directive('newTicket', function($location) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.isCompletedDisabled = function() {
                if (scope.expiredSelection === 'onlyExpired') {
                    scope.completedSelection = 'excludeCompleted';
                    return true;
                } else {
                    return false;
                }
            }

            $(".dropdown-toggle").on('click', function() {
                $(".dropdown-menu li a").click(function(){
                    $(".btn:first-child").text($(this).text());
                    $(".btn:first-child").val($(this).text());
                    scope.priority = $(this).text();
                });
            });
        }
    }
});