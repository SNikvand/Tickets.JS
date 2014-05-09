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
        .when('/viewtickets/ticket/:ticketid/:isArchive', {
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
        .when('/viewtickets/department/:dept', {
            templateUrl: '/partials/admin/viewtickets.html',
            controller: 'viewticketsController',
            resolve: {
                verifyAccess: function(verifyAccess) { // should use separate function to verify ticket page
                    verifyAccess.checkPage("dept");
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
        .when('/replyticket', {
            templateUrl: '/partials/admin/replyticket.html',
            //controller: 'replyticketController',
            resolve: {
                verifyAccess: function(verifyAccess) {
                    verifyAccess.checkPage("replyticket");
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
    };

    $scope.viewTicketsByDept = function(name) {
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
            searchTitle: false,
            searchBody: false,
            expiredSelection: true,
            completedSelection: true,
            amount: null
        };

        ticketParams.setParams($scope.session, formdata, true);
        $location.path('/viewtickets');
    };

    $scope.resetViewParams = function() {
        console.log("panel test: " + JSON.stringify($scope.session));
        ticketParams.resetParams($scope.session);
    }
});

adminModule.controller('overviewController', function($scope, $location) {
    console.log("base session test: "  + JSON.stringify($scope.session));

    $scope.overview1 = "Tickets Nearly Due";
    $scope.overview2 = "Expired Tickets";
    $scope.overview3 = "Recently Completed Tickets";
});

adminModule.controller('restrictController', function($scope) {

});

adminModule.controller('viewticketsController', function($scope, $location, ticketParams) {
    ticketParams.reqTickets($scope.session);

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'table-cell';
    }

    $scope.deleteTicket = function(id, isArchive) {
        // emit socket to database to delete ticket marked 'id'
        // notifyjs notification here that item has been deleted

        // 'isArchive' checks which table the ticket is in

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
    var searchParams = {keywords: null, inTitle: false, inBody: false};
    var includeCompleted = 'includeCompleted';
    var includeExpired = 'includeExpired';
    var includeArchived = 'excludeArchived';
    var amount = null;

    this.setParams = function(session, formdata, frompanel) {
        if (session.role == "Manager" && frompanel == false) {
            // stringify the departments
            var stringDepts = "";
            for (var x in session.dept) {
                stringDepts += session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            formdata.dept = stringDepts;
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
        includeArchived = formdata.archivedSelection;

        amount = formdata.amount;

        console.log("search test: " + JSON.stringify(formdata));
        $location.path('/viewtickets');
    };

    this.resetParams = function(session, frompanel) {
        for (var x in viewfilters) {
            viewfilters[x] = null;
        }

        if (session.role == "Manager") {
            // stringify the departments
            var stringDepts = "";
            for (var x in session.dept) {
                stringDepts += session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user;
        }

        searchParams = {keywords: null, inTitle: false, inBody: false};
        includeCompleted = true;
        includeExpired = true;
        includeArchived = false;
        amount = null;
        console.log("resetted");
    };

    this.reqTickets = function(session) {
        if (session.role == "Manager") {
            // stringify the departments
            var stringDepts = "";
            for (var x in session.dept) {
                stringDepts += session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user;
        }

        console.log("view test: " +  JSON.stringify(viewfilters));
        console.log("view test (search): " + JSON.stringify(searchParams));
        console.log("view test (includeCompleted): " + includeCompleted);
        console.log("view test (includeExpired): " + includeExpired);
        console.log("view test (amount): " + amount);
        socket.emit('getTicketsView', viewfilters, searchParams, includeCompleted, includeExpired, includeArchived, null, "create_date", "desc");
    };
});

adminModule.controller('ticketController', function($scope, $routeParams) {
    // retrieves ticket information
    // using $routeParams.ticketid and $routeParams.isArchive

    socket.emit('getTicket', $routeParams.ticketid, $routeParams.isArchive);
    socket.on('displayTicket', function(hash, title, department, description, priority, author, author_email, assigned_to, altered_by,
                                        create_date, due_date, altered_date, complete_date) {

        $scope.id = hash;
        $scope.title = title;
        $scope.author = author;
        $scope.email = author_email;
        $scope.create_date = create_date;
        $scope.department = department;
        $scope.body = description;
        $scope.priority = priority;
        $scope.due_date = due_date;
        $scope.assigned_to = assigned_to;
        $scope.altered_date = altered_date;
        $scope.altered_by = altered_by;
        $scope.complete_date = complete_date;
        $scope.$apply();
    });

});

adminModule.controller('newticketController', function($scope, $location) {
    $scope.submit = function() {
        socket.emit('setTicket', null, $scope.title, $scope.dept, $scope.body, $scope.priority, $scope.user, $scope.email,
            null, null, null, null, null, null, false);

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
    $scope.archivedSelection = 'excludeArchived';
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
            archivedSelection: $scope.archivedSelection,
            amount: null
        };

        ticketParams.setParams($scope.session, formdata, false);
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
        socket.emit('setUser', null, $scope.name, $scope.email, $scope.password, $scope.role);
        $location.path('/viewusers');
    }
});

adminModule.controller('viewdeptController', function($scope) {
    socket.emit('getDepts');

    $scope.deleteDept = function(id) {
        // emit socket to database to delete department marked 'id'
        // notifyjs notification here that item has been deleted
        $location.path('/viewtickets');
    }
});

adminModule.controller('newdeptController', function($scope, $location) {
    $scope.create = function() {
        socket.emit('setDept', null, $scope.deptname, $scope.managers);
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
            var searchParams = {keywords: null, inTitle: false, inBody: false};

            // stringify the departments
            var stringDepts = "";
            for (var x in scope.session.dept) {
                stringDepts += scope.session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            // configure default filter parameters
            if (scope.session.role == "Admin") {
                defFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
                    assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
            } else if (scope.session.role == "Manager") {
                defFilters = {dept: stringDepts, priority: null, submittedBy: null, clientEmail: null,
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

            // get soon-to-expire list
            socket.emit(getMessages[0], defFilters, searchParams, "excludeCompleted", "excludeExpired", "excludeArchived", 5, "due_date", "asc");
            socket.on(displayMessages[0], function(ticketList) {
                scope.ticketList1 = ticketList;
                scope.$apply();
            });

            // get expired list
            socket.emit(getMessages[1], defFilters, searchParams, "excludeCompleted", "onlyExpired", "excludeArchived", 5, "due_date", "desc");
            socket.on(displayMessages[1], function(ticketList) {
                scope.ticketList2 = ticketList;
                scope.$apply();
            });

            // get completed list
            socket.emit(getMessages[2], defFilters, searchParams, "onlyCompleted", "excludeExpired", "excludeArchived", 5, "complete_date", "desc");
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
                socket.emit('getTicket', newid, false);
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
                scope.departments = {};

                console.log(JSON.stringify(deptList));

                for (var dept in deptList) {
                    if (!scope.departments[deptList[dept].name]) {
                        scope.departments[deptList[dept].name] = {id: null, name: null, managers: []};
                        // scope.departments[deptList[dept].name].id = ___ // get department id
                        scope.departments[deptList[dept].name].name = deptList[dept].name;
                    }
                    scope.departments[deptList[dept].name].managers.push(deptList[dept].manager);
                }

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

adminModule.directive('searchTickets', function($location) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.isManager = function() {
                if (scope.session.role == "Manager") {
                    return true;
                } else {
                    return false;
                }
            }

            scope.isITUser = function() {
                if (scope.session.role == "IT User") {
                    return true;
                } else {
                    return false;
                }
            }

            scope.isCompletedDisabled = function() {
                if (scope.expiredSelection === 'onlyExpired') {
                    scope.completedSelection = 'excludeCompleted';
                    return true;
                } else {
                    return false;
                }
            };
            scope.isExpiredDisabled = function() {
                if(scope.completedSelection === 'onlyCompleted' || scope.archivedSelection === 'onlyArchived') {
                    scope.expiredSelection = 'excludeExpired';
                    return true;
                } else {
                    return false;
                }
            };

            scope.isArchivedDisabled = function() {
                if(scope.completedSelection === 'excludeCompleted' || scope.expiredSelection === 'onlyExpired') {
                    scope.archivedSelection = 'excludeArchived';
                    return true;
                } else {
                    return false;
                }
            };

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
                });
            });
        }
    }
});

adminModule.directive('replyTicket', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            //JQuery functions can go in here
            $("#piority").click(function() {
                if($("#piority").val() == "1"){
                    $("#piority").css("background-color", "#FA6666");
                }
                if($("#piority").val() == "2"){
                    $("#piority").css("background-color", "#FF7307");
                }
                if($("#piority").val() == "3"){
                    $("#piority").css("background-color", "#FFEF07");
                }
                if($("#piority").val() == "4"){
                    $("#piority").css("background-color", "#64A227");
                }
                if($("#piority").val() == "5"){
                    $("#piority").css("background-color", "#7EEB12");
                }
                if($("#piority").val() == "6"){
                    $("#piority").css("background-color", "#12ECEC");
                }
            });

        }
    }
});