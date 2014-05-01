angular
    .module('admin',[
        'ui.router'
    ])
    .config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/template/home.html',
                data: {pageid: "home"},
                resolve: {
                    verifyAccess: function(verifyAccess) {
                        verifyAccess.checkPage(this.data.pageid);
                    },
                    delay: function($q, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function() {
                            deferred.resolve();
                        }, 100);
                        return deferred.promise;
                    }
                }
            })
            .state('restrict', {
                url: '/restrict',
                templateUrl: 'template/restrict.html',
                data: {pageid: "restrict"}
            })
            .state('newuser', {
                url: '/newuser',
                templateUrl: '/template/newUser.html',
                data: {pageid: "newuser"},
                resolve: {
                    verifyAccess: function(verifyAccess) {
                        verifyAccess.checkPage(this.data.pageid);
                    },
                    delay: function($q, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function() {
                            deferred.resolve();
                        }, 100);
                        return deferred.promise;
                    }
                }
            })
            .state('viewtickets', {
                url: '/viewtickets',
                templateUrl: '/template/viewTickets.html',
                data: {pageid: "viewtickets"},
                resolve: {
                    verifyAccess: function(verifyAccess) {
                        verifyAccess.checkPage(this.data.pageid);
                    },
                    delay: function($q, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function() {
                            deferred.resolve();
                        }, 100);
                        return deferred.promise;
                    }
                }
            })
            .state('viewusers', {
                url: '/viewusers',
                templateUrl: '/template/viewUsers.html',
                data: {pageid: "viewusers"},
                resolve: {
                    verifyAccess: function(verifyAccess) {
                        verifyAccess.checkPage(this.data.pageid);
                    },
                    delay: function($q, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function() {
                            deferred.resolve();
                        }, 100);
                        return deferred.promise;
                    }
                }
            })
    }])
    .service('verifyAccess', function($http, $state) {
        this.checkPage = function(pageid) {
            return $http({method: "POST", url: "/verifyAccess", data: {pageid: pageid},
                headers: {'Content-Type': 'application/json'}})
                .success(function (data) {
                    console.log(data);
                    if (data.toString() == "false") {
                        console.log("rejected");
                        $state.go('restrict');
                    } else if (data.toString() == "true") {
                        console.log("resolved");
                    }
            });
        };
    });
