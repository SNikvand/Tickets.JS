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
        .when('/viewdepts', {
            templateUrl: '/partials/admin/viewdepts.html',
            controller: 'viewdeptController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("viewdepts");
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
        .when('/newdept', {
            templateUrl: '/partials/admin/newdept.html',
            controller: 'newdeptController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("newdept");
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
            $scope.userdept = $scope.session.dept;
        });
});

adminModule.controller('panelController', function($scope, $location, ticketParams) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }

    $scope.viewTicketsByDept = function(name) {
        console.log("test: " + name);

        var formdata = {
            dept: name,
            priority: null,
            assignedTo: null,
            alteredBy: null,
            submittedBy: null,
            clientEmail: null,
            // dateCreated: $scope.dateCreated, -- not implemented yet
            // dateAltered: $scope.dateAltered, -- not implemented yet

            keywords: null,
            searchTitle: true,
            searchBody: true,
            expiredSelection: true,
            completedSelection: true,
            amount: null
        };

        ticketParams.setParams($scope.session, formdata);
        $location.path('/viewtickets');
    }

    $scope.resetViewParams = function() {
        console.log("panel test: " + JSON.stringify($scope.session));
        ticketParams.resetParams($scope.session);
    }
});

adminModule.controller('overviewController', function($scope) {
    console.log("base session test: "  + JSON.stringify($scope.session));
});

adminModule.controller('restrictController', function($scope) {

});

adminModule.controller('viewticketsController', function($scope, $location, ticketParams) {
    ticketParams.reqTickets();

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'table-cell';
    }

    $scope.deleteTicket = function(id) {
        // emit socket to database to delete ticket marked 'id'
        // notifyjs notification here that item has been deleted
        $location.path('/viewtickets');
    }
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

adminModule.service('ticketParams', function($location) {
    var viewfilters = {dept: null, priority: null, assignedTo: null, alteredBy: null, submittedBy: null, clientEmail: null,
        dateCreated: null, dateAltered: null};
    var searchParams = {keywords: null, inTitle: true, inBody: true};
    var includeCompleted = true;
    var includeExpired = true;
    var amount = null;

    this.setParams = function(session, formdata) {
        if (session.role == "Manager") {
            formdata.dept = session.dept; // FIX THIS !!!
        } else if (session.role == "IT User") {
            formdata.assignedTo = session.user;
        }

        viewfilters.dept = formdata.dept;
        viewfilters.priority = formdata.priority;
        viewfilters.assignedTo = formdata.assignedTo;
        viewfilters.alteredBy = formdata.alteredBy;
        viewfilters.submittedBy = formdata.submittedBy;
        viewfilters.clientEmail = formdata.clientEmail;
        // viewfilters.dateCreated = formdata.dateCreated;
        // viewfilters.dataAltered = formdata.dateAltered;

        searchParams.keywords = formdata.keywords;
        searchParams.inTitle = formdata.searchTitle;
        searchParams.inBody = formdata.searchBody;

        includeCompleted = formdata.completedSelection;
        includeExpired = formdata.expiredSelection;

        amount = formdata.amount;

        console.log("search test: " + JSON.stringify(formdata));
        $location.path('/viewtickets');
    };

    this.resetParams = function(session) {
        for (var x in viewfilters) {
            viewfilters[x] = null;
        }
        searchParams = {keywords: null, inTitle: false, inBody: false};
        includeCompleted = true;
        includeExpired = true;
        amount = null;
        console.log("resetted");
    }

    this.reqTickets = function() {
        console.log("view test: " +  JSON.stringify(viewfilters));
        console.log("view test (search): " + JSON.stringify(searchParams));
        console.log("view test (includeCompleted): " + includeCompleted);
        console.log("view test (includeExpired): " + includeExpired);
        console.log("view test (amount): " + amount);
        socket.emit('getTicketsView', viewfilters, searchParams, includeCompleted, includeExpired, null);
    };
});

adminModule.controller('ticketController', function($scope) {

});

adminModule.controller('newticketController', function($scope, $location) {
    $scope.submit = function() {
        socket.emit('setTicket', null, $scope.title, $scope.dept, $scope.body, $scope.priority, $scope.user, $scope.email,
        null, null, null, null, null, null);

        $location.path('/viewtickets');
    }
});

adminModule.controller('searchticketController', function($scope, ticketParams) {
    $scope.dept = null;
    $scope.assignedTo = null;
    $scope.alteredBy = null;
    $scope.submittedBy = null;
    $scope.clientEmail = null;
    $scope.keywords = null;
    $scope.searchTitle = false;
    $scope.searchBody = false;
    $scope.expiredSelection = 'includeExpired';
    $scope.completedSelection = 'includeCompleted';
    $scope.priority = null;

    $scope.search = function() {
        var formdata = {
            dept: $scope.dept,
            priority: $scope.priority,
            assignedTo: $scope.assignedTo,
            alteredBy: $scope.alteredBy,
            submittedBy: $scope.submittedBy,
            clientEmail: $scope.clientEmail,
            // dateCreated: $scope.dateCreated, -- not implemented yet
            // dateAltered: $scope.dateAltered, -- not implemented yet

            keywords: $scope.keywords,
            searchTitle: $scope.searchTitle,
            searchBody: $scope.searchBody,
            expiredSelection: $scope.expiredSelection,
            completedSelection: $scope.completedSelection,
            amount: null
        }

        ticketParams.setParams($scope.session, formdata);
    };
});

adminModule.controller('viewuserController', function($scope) {
    socket.emit('getUsers', null);

    $scope.deleteUser = function(id) {
        // emit socket to database to delete user marked 'id'
        // notifyjs notification here that item has been deleted
        $location.path('/viewtickets');
    }
});

adminModule.controller('newuserController', function($scope, $location) {
    $scope.register = function() {
        if ($scope.role == "Admin") {
            $scope.dept = null;
        }

        // for testing purposes only, dept is null
        // to do: finalize the form for selecting departments to assign to a user
        $scope.dept = null;
        // end testing

        socket.emit('setUser', $scope.firstname, $scope.lastname, $scope.username, $scope.email, $scope.password, $scope.role, $scope.dept);
        $location.path('/viewusers');
    }
});

adminModule.controller('viewdeptController', function($scope) {
    socket.emit('getDepts', null);

    $scope.deleteDept = function(id) {
        // emit socket to database to delete department marked 'id'
        // notifyjs notification here that item has been deleted
        $location.path('/viewtickets');
    }
});

adminModule.controller('newdeptController', function($scope, $location) {
    $scope.create = function() {
        socket.emit('setDept', $scope.deptname, $scope.manager);
        $location.path('/viewdepts');
    }
});

adminModule.controller('mailsettingsController', function($scope) {

});

adminModule.controller('settingsController', function($scope) {

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
            var defFilters;

            // configure default filter parameters
            if (scope.session.role == "Admin") {
                defFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
                    assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
            } else if (scope.session.role == "Manager") {
                defFilters = {dept: scope.session.dept, priority: null, submittedBy: null, clientEmail: null,
                    assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
            } else if (scope.session.role == "IT User") {
                defFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
                    assignedTo: scope.session.user, alteredBy: null, dateCreated: null, dateAltered: null};
            }

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
            socket.emit(getMessages[0], defFilters, null, "exclude", "include", 5);
            socket.on(displayMessages[0], function(ticketList) {
                scope.ticketList1 = ticketList;
                scope.$apply();
            });

            // get expired list
            socket.emit(getMessages[1], defFilters, null, "exclude", "only", 5);
            socket.on(displayMessages[1], function(ticketList) {
                scope.ticketList2 = ticketList;
                scope.$apply();
            });

            // get soon-to-expire list
            socket.emit(getMessages[2], defFilters, null, "exclude", "exclude", 5);
            socket.on(displayMessages[2], function(ticketList) {
                scope.ticketList3 = ticketList;
                scope.$apply();
            });
        }
    }
});

adminModule.directive('viewTickets', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            if (scope.session.role != "IT User") {
                $('#controlheader').css('display', 'table-cell');
            }

            socket.on('displayTicketsView', function(ticketList) {
                scope.maintickets = ticketList;
                scope.$apply();
            });

            socket.on('newTicket', function(newid) {
                socket.emit('getTicket', newid);
                socket.on('displayTicket',
                    function(id, title, dept, description, priority, submittedBy, clientEmail,
                        assignedTo, alteredBy, dateCreated, dateDue, dateAltered, dateCompleted) {
                        scope.newtickets.push({
                            id: id, priority: priority, title: title, dept: dept, assignedTo: assignedTo,
                            dateCreated: dateCreated, dateAltered: dateAltered
                        });
                        scope.$apply();
                    });
            });
        }
    }
});

adminModule.directive('viewUsers', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayUsers', function(userList) {
                scope.mainusers = userList;
                scope.$apply();
            });
        }
    }
});

adminModule.directive('viewDepts', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayDepts', function(deptList) {
                scope.departments = deptList;
                scope.$apply();
            });
        }
    }
});

adminModule.directive('newTicket', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.isUser = function() {
                if (scope.session.role == "Admin" || scope.session.role == "Manager" || scope.session.role == "IT User") {
                    scope.user = scope.session.user;
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
});

adminModule.directive('searchTickets', function($location) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.isOnlyExpired = function() {
                if (scope.expiredSelection === 'onlyExpired') {
                    scope.completedSelection = 'excludeCompleted';
                    return true;
                } else {
                    return false;
                }
            }
            scope.isOnlyCompleted = function() {
                if(scope.completedSelection === 'onlyCompleted') {
                    scope.expiredSelection = 'excludeExpired';
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
                    scope.role = $(this).text();

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