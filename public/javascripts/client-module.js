/**
 * Created by Chris on 08/05/2014.
 */
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

clientModule.controller('newticketController', function($scope) {

});

clientModule.controller('viewticketController', function($scope) {

});