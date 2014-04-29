angular
    .module('admin',[
        'ui.router'
    ])
    .config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/template/home.html'
            })
            .state('newuser', {
                url: '/newuser',
                templateUrl: '/template/newUser.html'
            })
            .state('viewtickets', {
                url: '/viewtickets',
                templateUrl: '/template/viewTickets.html'
            })
            .state('viewusers', {
                url: '/viewusers',
                templateUrl: '/template/viewUsers.html'
            })
    }]);