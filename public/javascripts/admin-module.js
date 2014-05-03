var adminModule = angular.module('admin', ['ngRoute']);

adminModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/overview', {
            templateUrl: '/partials/admin/overview.html',
            controller: 'overviewController'
        })
        .when('/viewtickets', {
            templateUrl: '/partials/admin/viewtickets.html',
            controller: 'viewticketsController'
        })
        .when('/viewtickets/:ticketid', {
            templateUrl: '/partials/admin/ticket.html',
            controller: 'ticketController'
        })
        .when('/newticket', {
            templateUrl: '/partials/admin/newticket.html',
            controller: 'newticketController'
        })
        .when('/searchticket', {
            templateUrl: '/partials/admin/searchticket.html',
            controller: 'searchticketController'
        })
        .when('/viewusers', {
            templateUrl: '/partials/admin/viewusers.html',
            controller: 'viewuserController'
        })
        .when('/newuser', {
            templateUrl: '/partials/admin/newuser.html',
            controller: 'newuserController'
        })
        .when('/settings/mail', {
            templateUrl: '/partials/admin/mailsettings.html',
            controller: 'mailsettingsController'
        })
        .when('/settings', {
            templateUrl: '/partials/admin/settings.html',
            controller: 'settingsController'
        })
        .otherwise({
            redirectTo: '/overview'
        });
});

adminModule.controller('panelController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});

adminModule.controller('overviewController', function($scope) {

});

adminModule.controller('viewticketsController', function($scope) {

});

adminModule.controller('ticketController', function($scope) {

});

adminModule.controller('newticketController', function($scope) {

});

adminModule.controller('searchticketController', function($scope) {

});

adminModule.controller('viewuserController', function($scope) {

});

adminModule.controller('newuserController', function($scope) {

});

adminModule.controller('mailsettingsController', function($scope) {

});

adminModule.controller('settingsController', function($scope) {

});