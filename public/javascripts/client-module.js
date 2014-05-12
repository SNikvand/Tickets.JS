var clientModule = angular.module('client', ['ngRoute']);

//routing configuration for the portal page.
clientModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/newticket', { // default route
            templateUrl: '/partials/client/newticket.html',
            controller: 'newticketController'
        })
        .when('/test', { // route when user has a Hash value for a previously made ticket.
            templateUrl: '/partials/client/testclient.html',
            controller: 'viewticketController'
        })
        .when('/viewticket', {      // route sent to after ticket creation.  May be a placeholder till hash is working.
            templateUrl: '/partials/client/viewticket.html',
            controller: 'viewticketController'
        })
        .otherwise({      // redirect if improper route entered.
            redirectTo: '/newticket'
        });
});

// new ticket controller
clientModule.controller('newticketController', function($scope, $location) {
    $scope.submit = function() { // when submit is pressed sends the data in the fields
        socket.emit('setTicket', null, $scope.title, $scope.dept, $scope.body, $scope.priority, $scope.user, $scope.email,
            null, null, null, null, null, null, false);

        $location.path('/viewticket'); // routes to a view of the newly created ticket.

    }
});

clientModule.controller('viewticketController', function($scope) {

});

// this directive controls the drop-down options on the new ticket page.
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