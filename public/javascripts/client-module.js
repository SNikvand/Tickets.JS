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
        .otherwise({
            redirectTo: '/newticket'
        });
});

// new ticket controller
clientModule.controller('newticketController', function($scope, $location) {
    $scope.submit = function() { // when submit is pressed sends the data in the fields
        socket.emit('setTicket', null, $scope.title, $scope.dept, $scope.body, $scope.priority, $scope.user, $scope.email,
            null, null, null, null, null, null, false);

        $location.path('/viewtickets');
    }
});

clientModule.controller('viewticketController', function($scope) {

});

clientModule.directive('newTicket', function() {
    $(".dropdown-toggle").on('click', function() {
        $(".dropdown-menu li a").click(function(){
            $(".btn:first-child").text($(this).text());
            $(".btn:first-child").val($(this).text());
            scope.priority = $(this).text();
        });
    });
});