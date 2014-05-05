var adminModule = angular.module('admin', ['ngRoute']);

adminModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/overview', {
            templateUrl: '/partials/admin/overview.html',
            controller: 'overviewController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("overview");
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
        .when('/restrict', {
            templateUrl: '/partials/admin/restrict.html',
            controller: 'restrictController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("restrict");
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
        .when('/viewtickets', {
            templateUrl: '/partials/admin/viewtickets.html',
            controller: 'viewticketsController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("viewtickets");
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
        .when('/viewtickets/ticket/:ticketid', {
            templateUrl: '/partials/admin/ticket.html',
            controller: 'ticketController',
            resolve: {
                verifyAccess: function(verifyAccess) { // should use separate function to verify ticket page
                    verifyAccess.checkPage("ticket");
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
        .when('/newticket', {
            templateUrl: '/partials/admin/newticket.html',
            controller: 'newticketController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("newticket");
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
        .when('/searchticket', {
            templateUrl: '/partials/admin/searchticket.html',
            controller: 'searchticketController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("searchticket");
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
        .when('/viewusers', {
            templateUrl: '/partials/admin/viewusers.html',
            controller: 'viewuserController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("viewusers");
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
        .when('/newuser', {
            templateUrl: '/partials/admin/newuser.html',
            controller: 'newuserController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("newuser");
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
        .when('/settings/mail', {
            templateUrl: '/partials/admin/mailsettings.html',
            controller: 'mailsettingsController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("mailsettings");
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
        .when('/settings', {
            templateUrl: '/partials/admin/settings.html',
            controller: 'settingsController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("settings");
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
        .otherwise({
            redirectTo: '/overview'
        });
});

// get session variables from server
adminModule.controller('sessionController', function($scope, $http) {
    $http({method: "GET", url: "/getSession", headers: {'Content-Type': 'application/json'}})
        .success(function (data) {
            $scope.session = data;
        });
});

adminModule.controller('panelController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});

adminModule.controller('overviewController', function($scope) {

});

adminModule.controller('restrictController', function($scope) {

});

adminModule.controller('viewticketsController', function($scope) {
    $scope.generateList = function(ticketList) {
        var listMarkup = '';

        listMarkup += '<table><tr>' +
            '<th>Priority</th>' +
            '<th>Title</th>' +
            '<th>Department</th>' +
            '<th>Assigned To</th>' +
            '<th>Date Created</th>' +
            '<th>Date Altered</th>' +
            '</tr>';

        for (var x in ticketList) {
            listMarkup += '<tr>';

            switch (ticketList[x].priority) {
                case 1:
                    listMarkup += '<td class="priority1">1</td>';
                    break;
                case 2:
                    listMarkup += '<td class="priority2">2</td>';
                    break;
                case 3:
                    listMarkup += '<td class="priority3">3</td>';
                    break;
                case 4:
                    listMarkup += '<td class="priority4">4</td>';
                    break;
                case 5:
                    listMarkup += '<td class="priority5">5</td>';
                    break;
                default:
                    console.log("error: invalid priority level");
            }

            listMarkup += ticketList[x].title == null ? '<td></td>' : '<td>' + ticketList[x].title + '</td>';
            listMarkup += ticketList[x].dept == null ? '<td></td>' : '<td>' + ticketList[x].dept + '</td>';
            listMarkup += ticketList[x].assignedTo == null ? '<td></td>' : '<td>' + ticketList[x].assignedTo + '</td>';

            // dates will probably be parsed differently
            listMarkup += ticketList[x].dateCreated == null ? '<td></td>' : '<td>' + ticketList[x].dateCreated + '</td>';
            listMarkup += ticketList[x].dateAltered == null ? '<td></td>' : '<td>' + ticketList[x].dateAltered + '</td>';

            listMarkup += '</tr>';
        }

        listMarkup += '</table>';

        return listMarkup;
    };
});

adminModule.controller('ticketController', function($scope) {

});

adminModule.controller('newticketController', function($scope) {

});

adminModule.controller('searchticketController', function($scope) {
    $scope.departments = $scope.session.depts;
});

adminModule.controller('viewuserController', function($scope) {

});

adminModule.controller('newuserController', function($scope) {

});

adminModule.controller('mailsettingsController', function($scope) {

});

adminModule.controller('settingsController', function($scope) {

});

// server-side authentication
adminModule.service('verifyAccess', function($http, $location) {
    this.checkPage = function(pageid) {
        return $http({method: "POST", url: "/verifyAccess", data: {pageid: pageid},
            headers: {'Content-Type': 'application/json'}})
            .success(function (data) {
                if (data.toString() == "false") {
                    $location.path('/restrict');
                } else if (data.toString() == "true") {
                    // do nothing
                }
            });
    };
});

adminModule.directive('welcomeInfo', function() {
    return {
        restrict: 'A',
        template:
            '<p>Welcome, {{ session.user }}!</p>' +
            '<p>{{ lastLoginInfo }}' +
            ' <a href="{{ lastLoginLink }}">{{ lastLoginNumber }}' + 
            '</a>' +
            '<p>{{ totalInfo }}' +
            ' <a href="{{ totalLink }}">{{ totalNumber }}' +
            '</a>',
        link: function(scope, element, attrs) {
            var role = scope.session.role;

            if (role == "Admin") {
                scope.lastLoginInfo = "New tickets since last login:";
                scope.lastLoginLink = "testlink";
                scope.lastLoginNumber = "dummyNumber"; // emit socket message to retrieve value from database

                scope.totalInfo = "Total number of tickets:";
                scope.totalLink = "testlink2";
                scope.totalNumber = "dummyNumber2";
            } else if (role == "Manager") {
                scope.lastLoginInfo = "New tickets since last login:";
                scope.lastLoginLink = "testlink";
                scope.lastLoginNumber = "dummyNumber"; // emit socket message to retrieve value from database

                scope.totalInfo = "Total number of tickets:";
                scope.totalLink = "testlink2";
                scope.totalNumber = "dummyNumber2";
            } else if (role == "IT User") {
                scope.lastLoginInfo = "New ticket assignments since last login:";
                scope.lastLoginLink = "testlink";
                scope.lastLoginNumber = "dummyNumber"; // emit socket message to retrieve value from database

                scope.totalInfo = "Total number of assigned tickets:";
                scope.totalLink = "testlink2";
                scope.totalNumber = "dummyNumber2";
            }
        }
    }
});

adminModule.directive('overTickets', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var role = scope.session.role;
            var defFilters = scope.session.filters;
            var getMessages, displayMessages;
            if (role == "Admin") {
                getMessages = ['getTicketsAdmin1', 'getTicketsAdmin2', 'getTicketsAdmin3'];
                displayMessages = ['displayTicketsAdmin1', 'displayTicketsAdmin2', 'displayTicketsAdmin3'];
            } else if (role == "Manager") {
                getMessages = ['getTicketsManager1', 'getTicketsManager2', 'getTicketsManager3'];
                displayMessages = ['displayTicketsManager1', 'displayTicketsManager2', 'displayTicketsManager3'];
            } else if (role == "IT User") {
                getMessages = ['getTicketsITUser1', 'getTicketsITUser2', 'getTicketsITUser3'];
                displayMessages = ['displayTicketsITUser1', 'displayTicketsITUser2', 'displayTicketsITUser3'];
            }

            // get main list
            socket.emit(getMessages[0], defFilters, null, "include", "exclude", 5);
            socket.on(displayMessages[0], function(ticketList) {
                $('#overview3').html(scope.generateList(ticketList)); // replace with function to populate overview tables
            });

            // get expired list
            socket.emit(getMessages[1], defFilters, null, "exclude", "only", 5);
            socket.on(displayMessages[1], function(ticketList) {
                $('#overview2').html(scope.generateList(ticketList)); // replace with function to populate overview tables
            });

            // get soon-to-expire list
            socket.emit(getMessages[2], defFilters, null, "exclude", "exclude", 5);
            socket.on(displayMessages[2], function(ticketList) {
                $('#overview1').html(scope.generateList(ticketList)); // replace with function to populate overview tables
            });
        }
    }
});

adminModule.directive('searchTickets', function($location, $timeout) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.isOnlyExpired = function() {
                return scope.expiredSelection === 'onlyExpired';
            }
            scope.isOnlyCompleted = function() {
                return scope.completedSelection === 'onlyCompleted';
            }

            scope.search = function() {
                /*console.log(scope.dept);
                console.log(scope.assignedTo);
                console.log(scope.alteredBy);
                console.log(scope.submittedBy);
                console.log(scope.clientEmail);
                console.log(scope.keywords);
                console.log(scope.searchTitle);
                console.log(scope.searchBody);
                console.log(scope.expiredSelection);
                console.log(scope.completedSelection);*/
            }
        }
    }
});

adminModule.directive('userCreation', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            //JQuery functions can go in here
            $("#cpassword").keyup(function() {
                if ($('#cpassword').val() != $('#password').val())
                    $("#passwordnotmatch").show();
                else
                    $("#passwordnotmatch").hide();
            });

            $(".dropdown-toggle").on('click', function() {
                $(".dropdown-menu li a").click(function(){
                    $(".btn:first-child").text($(this).text());
                    $(".btn:first-child").val($(this).text());
                    if ($(this).text() == 'Administrator') {
                        $("#depart").hide("slow");
                        $("#admintext").show();
                    }
                    else {
                        $("#depart").show();
                        $("#admintext").hide("slow");
                    }
                });
            });
        }
    }
});