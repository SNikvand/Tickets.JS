angular
    .module('admin',[
        'ui.router'
    ])
    .config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/template/home.html',
                data: {pageid: "home"}
            })
            .state('newuser', {
                url: '/newuser',
                templateUrl: '/template/newUser.html',
                data: {pageid: "newuser"}
            })
            .state('viewtickets', {
                url: '/viewtickets',
                templateUrl: '/template/viewTickets.html',
                data: {pageid: "viewtickets"}
            })
            .state('viewusers', {
                url: '/viewusers',
                templateUrl: '/template/viewUsers.html',
                data: {pageid: "viewusers"}
            })
    }])
    .run(function($rootScope, $http) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $http({method: "POST", url: "/verifyAccess", data: {pageid: toState.data.pageid},
                    headers: {'Content-Type': 'application/json'}})
                    .success(function(data) {
                        console.log(data);
                        if (data == "false") {
                            console.log("access denied");
                            event.preventDefault();
                        }
                    })
            });
    });