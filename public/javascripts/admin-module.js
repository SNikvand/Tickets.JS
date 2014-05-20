//created by Shahin Nikvand
//edited by Matthew Chan

var adminModule = angular.module('admin', ['ngRoute', 'textAngular']);

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
        .when('/viewtickets/userticket/:ticketid/:isArchive', {
            templateUrl: '/partials/admin/ticket.html',
            controller: 'ticketController',
            resolve: {
                verifyAccess: function($route, verifyAccess) {
                    verifyAccess.checkPage("ticket", $route.current.params.ticketid, $route.current.params.isArchive);
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
            controller: 'viewticketsDeptController',
            resolve: {
                verifyAccess: function($route, verifyAccess) {
                    verifyAccess.checkPage("dept", $route.current.params.dept);
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
        .otherwise({
            redirectTo: '/overview'
        });
});

// get session variables from server
adminModule.controller('sessionController', function($scope, $http, $location) {
    $http({method: "GET", url: "/getSession", headers: {'Content-Type': 'application/json'}})
        .success(function (data) {
            $scope.session = data;
            $scope.userdept = $scope.session.dept;
        });

    $scope.errorMsg = null;
    socket.on('error', function(msg) {
        $scope.errorMsg = msg;
    });

    $scope.eraseErrorMsg = function() {
        $scope.errorMsg = null;
    }
});

adminModule.controller('panelController', function($scope, $location, ticketParams) {
    $scope.isActive = function(route) {
        return route === $location.path();
    };

    $scope.getDeptUrl = function(name) {
        name.replace(/'/g, "&#39;");
        return "/viewtickets/department/" + name;
    }

    $scope.viewTicketsByDept = function(name) {
        var formdata = {
            dept: "\"" + name + "\"",
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
            expiredSelection: "includeExpired",
            completedSelection: "includeCompleted",
            archivedSelection: "includeArchived",
            amount: null
        };

        ticketParams.setParams($scope.session, formdata, true);
        //$location.path('/viewtickets');
    };

    $scope.resetViewParams = function() {
        ticketParams.resetParams($scope.session);
    }
});

adminModule.controller('overviewController', function($scope, $http, $location) {
    console.log("base session test: "  + JSON.stringify($scope.session));

    $scope.showLoginTickets = false;
    $scope.showAssignedTickets = false;

    var role = $scope.session.role;
    var defFilters;
    var searchParams = {keywords: null, inTitle: false, inBody: false};

    // last logout time
    var lastLogout = $scope.session.lastLogout;

    // stringify the departments
    var stringDepts = "";
    for (var x in $scope.session.dept) {
        stringDepts += $scope.session.dept[x].replace(/'/g, "''") + " ";
    }
    stringDepts = stringDepts.trim();

    // configure default filter parameters
    if ($scope.session.role == "Admin") {
        defFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null, lastLogout: lastLogout};
    } else if ($scope.session.role == "Manager") {
        defFilters = {dept: stringDepts, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null, lastLogout: lastLogout};
    } else if ($scope.session.role == "IT User") {
        defFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
            assignedTo: $scope.session.user.replace(/'/g, "''"), alteredBy: null, dateCreated: null, dateAltered: null, lastLogout: lastLogout};
    }

    $scope.lastLogout = {numberOfTickets: 0, ticketList: null};
    $scope.assignedTickets = {numberOfTickets: 0, ticketList: null};

    socket.emit('getTicketsLogout', defFilters, searchParams, 'includeCompleted', 'includeExpired', 'includeArchived', null, "create_date", "desc");
    socket.emit('getTicketsView', defFilters, searchParams, 'excludeCompleted', 'includeExpired', 'excludeArchived', null, "create_date", "desc");

    $scope.toggleLoginTickets = function() {
        if ($scope.showLoginTickets == false) {
            $scope.showLoginTickets = true;
            $scope.showAssignedTickets = false;

            $scope.session.lastLogout = "loggedIn";
            $http({method: "POST", url: "/setLoggedIn", headers: {'Content-Type': 'application/json'}})
                .success(function (data) {
                    $scope.session.lastLogout = data;
                });
        } else {
            $scope.showLoginTickets = false;
        }
    }

    $scope.toggleAssignedTickets = function() {
        if ($scope.showAssignedTickets == false) {
            $scope.showAssignedTickets = true;
            $scope.showLoginTickets = false;
        } else {
            $scope.showAssignedTickets = false;
        }
    }

    $scope.overview1 = "Tickets Nearly Due";
    $scope.overview2 = "Expired Tickets";
    $scope.overview3 = "Recently Completed Tickets";
});

adminModule.controller('restrictController', function($scope) {

});

adminModule.controller('viewticketsController', function($scope, $timeout, $route, ticketParams) {
    ticketParams.reqTickets($scope.session, false);

    $scope.$on("$destroy", function(){
        $scope.eraseErrorMsg();
    });

    $scope.isArchiveStyle = function(ticket) {
        var rowStyle = {"background-color": "#fff"};
        if (ticket.isArchive == true) {
            rowStyle["background-color"] = "#FFE8A8";
        }
        return rowStyle;
    }

    $scope.errorMsg_assignedTo = null;

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'inline';
    }

    $scope.isEdit = null;
    $scope.isEditArchive = null;

    // display carets
    $scope.showCarets = true;

    // edited fields
    $scope.newPriority = null;
    $scope.newDept = null;
    $scope.newAssignedTo = null;
    $scope.isCompleted = null;
    $scope.alteredBy = $scope.session.user;

    // headings
    $scope.heading1 = "Priority";
    $scope.heading2 = "Title";
    $scope.heading3 = "Department";
    $scope.heading4 = "Assigned To";
    $scope.heading5 = "Date Due";
    $scope.heading6 = "Date Completed";

    $scope.setPriority = function(priority) {
        $scope.newPriority = priority;
    }

    $scope.setDept = function(dept) {
        $scope.newDept = dept;
    }

    $scope.saveEdits = function() {
        $scope.errorMsg_assignedTo = null;

        if ($scope.newAssignedTo != null) {
            $scope.newAssignedTo = $scope.newAssignedTo.trim();
            if ($scope.newAssignedTo == "") {
                $scope.errorMsg_assignedTo = "Username cannot be blank.";
                $scope.newAssignedTo = null;
                return;
            } else {
                $scope.newAssignedToEsc = $scope.newAssignedTo.replace(/'/g, "''");
                $scope.errorMsg_assignedTo = null;
            }
        }

        socket.emit('setTicket', $scope.isEdit, null, $scope.newDept, null, $scope.newPriority, null, null,
            $scope.newAssignedToEsc, $scope.alteredBy.replace(/'/g, "''"), null, null, null, $scope.isCompleted, $scope.isEditArchive, null);

        $timeout(function() {
            $route.reload();
        }, 500);
    }
  $scope.archiveTickets = function() {
    socket.emit('archiveTickets');

    $timeout(function() {
        $route.reload();
    }, 500);
  }

    $scope.toggleEdit = function(ticket) {
        if ($scope.isEdit != ticket.id || $scope.isEditArchive != ticket.isArchive) {
            $scope.errorMsg_assignedTo = null;

            $scope.isEdit = ticket.id;
            $scope.isEditArchive = ticket.isArchive;
            $scope.newPriority = ticket.priority;
            $scope.newDept = ticket.department;
            $scope.newAssignedTo = ticket.assigned_to;
            $scope.isCompleted = (ticket.complete_date != null);

            $scope.heading1 = "";
            $scope.heading2 = "";
            $scope.heading3 = "";
            $scope.heading4 = "";
            $scope.heading5 = "";
            $scope.heading6 = "";

            $scope.showCarets = false;
        } else {
            $scope.errorMsg_assignedTo = null;

            $scope.isEdit = null;
            $scope.isEditArchive = null;
            $scope.newPriority = null;
            $scope.newDept = null;
            $scope.newAssignedTo = null;
            $scope.isCompleted = false;

            $scope.heading1 = "Priority";
            $scope.heading2 = "Title";
            $scope.heading3 = "Department";
            $scope.heading4 = "Assigned To";
            $scope.heading5 = "Date Due";
            $scope.heading6 = "Date Completed";

            $scope.showCarets = true;
        }
    }

    $scope.checkIfEdit = function(id, isArchive) {
        return ($scope.isEdit == id && $scope.isEditArchive == isArchive);
    }

    $scope.storeDelete = function(id, isArchive) {
        $scope.id = id;
        $scope.isArchive = isArchive;
    }

    $scope.deleteTicket = function() {
        socket.emit('deleteTicket', $scope.id, $scope.isArchive);

        $timeout(function() {
            $route.reload();
        }, 500);
    }
});

adminModule.controller('viewticketsDeptController', function($scope, $location, $timeout, $route, $routeParams, ticketParams) {
    ticketParams.reqTickets($scope.session, true);

    $scope.$on("$destroy", function(){
        $scope.eraseErrorMsg();
    });

    $scope.isArchiveStyle = function(ticket) {
        var rowStyle = {"background-color": "#fff"};
        if (ticket.isArchive == true) {
            rowStyle["background-color"] = "#ffe8a8";
        }
        return rowStyle;
    }

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'inline';
    }

    $scope.errorMsg_assignedTo = null;

    $scope.isEdit = null;
    $scope.isEditArchive = null;

    // display carets
    $scope.showCarets = true;

    // edited fields
    $scope.newPriority = null;
    $scope.newDept = null;
    $scope.newAssignedTo = null;
    $scope.isCompleted = null;
    $scope.alteredBy = $scope.session.user

    // headings
    $scope.heading1 = "Priority";
    $scope.heading2 = "Title";
    $scope.heading3 = "Department";
    $scope.heading4 = "Assigned To";
    $scope.heading5 = "Date Due";
    $scope.heading6 = "Date Completed";

    $scope.setPriority = function(priority) {
        $scope.newPriority = priority;
    }

    $scope.setDept = function(dept) {
        $scope.newDept = dept;
    }

    $scope.saveEdits = function() {
        if ($scope.newAssignedTo != null) {
            $scope.newAssignedTo = $scope.newAssignedTo.trim();
            if ($scope.newAssignedTo == "") {
                $scope.errorMsg_assignedTo = "Username cannot be blank.";
                $scope.newAssignedTo = null;
                return;
            } else {
                $scope.errorMsg_assignedTo = null;
                $scope.newAssignedToEsc = $scope.newAssignedTo.replace(/'/g, "''");
            }
        }

        socket.emit('setTicket', $scope.isEdit, null, $scope.newDept, null, $scope.newPriority, null, null,
            $scope.newAssignedToEsc, $scope.alteredBy.replace(/'/g, "''"), null, null, null, $scope.isCompleted, $scope.isEditArchive, null);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    $scope.toggleEdit = function(ticket) {

        if ($scope.isEdit != ticket.id || $scope.isEditArchive != ticket.isArchive) {
            $scope.isEdit = ticket.id;
            $scope.isEditArchive = ticket.isArchive;
            $scope.newPriority = ticket.priority;
            $scope.newDept = ticket.department;
            $scope.newAssignedTo = ticket.assigned_to;
            $scope.isCompleted = (ticket.complete_date != null);

            $scope.heading1 = "";
            $scope.heading2 = "";
            $scope.heading3 = "";
            $scope.heading4 = "";
            $scope.heading5 = "";
            $scope.heading6 = "";

            $scope.showCarets = false;
        } else {
            $scope.errorMsg_assignedTo = null;

            $scope.isEdit = null;
            $scope.isEditArchive = null;
            $scope.newPriority = null;
            $scope.newDept = null;
            $scope.newAssignedTo = null;
            $scope.isCompleted = null;

            $scope.heading1 = "Priority";
            $scope.heading2 = "Title";
            $scope.heading3 = "Department";
            $scope.heading4 = "Assigned To";
            $scope.heading5 = "Date Due";
            $scope.heading6 = "Date Completed";

            $scope.showCarets = true;
        }
    }

    $scope.checkIfEdit = function(id, isArchive) {
        return ($scope.isEdit == id && $scope.isEditArchive == isArchive);
    }

    $scope.storeDelete = function(id, isArchive) {
        $scope.id = id;
        $scope.isArchive = isArchive;
    }

    $scope.deleteTicket = function() {
        socket.emit('deleteTicket', $scope.id, $scope.isArchive);

        $timeout(function() {
            $route.reload();
        }, 500);
    }
});

// server-side authentication
adminModule.service('verifyAccess', function($http, $location, $routeParams) {
    this.checkPage = function(pageid, param1, param2) {
        var extraParam1 = null;
        var extraParam2 = null;

        if (pageid == "ticket") {
            extraParam1 = param1;
            var isArchiveBool = (param2 === "true");
            extraParam2 = isArchiveBool;
        } else if (pageid == "dept") {
            extraParam1 = param1
        }

        return $http({method: "POST", url: "/verifyAccess",
            data: {pageid: pageid, extraParam1: extraParam1, extraParam2: extraParam2},
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

adminModule.service('ticketParams', function($location, $http) {
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
                stringDepts += session.dept[x].replace(/'/g, "''") + " ";
            }
            stringDepts = stringDepts.trim();

            formdata.dept = stringDepts;
        } else if (session.role == "IT User") {
            formdata.assignedTo = session.user.replace(/'/g, "''");
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

        // try to post parameters to server to store even after refresh
        $http({method: "POST", url: "/setFilters",
            data: {viewfilters: viewfilters, searchParams: searchParams, includeCompleted: includeCompleted,
                includeExpired: includeExpired, includeArchived: includeArchived, amount: amount},
            headers: {'Content-Type': 'application/json'}})
            .success(function (data) {
                session.filters = data;
                console.log("succeeding");
            });

        $location.path('/viewtickets');
    };

    this.resetParams = function(session) {
        for (var x in viewfilters) {
            viewfilters[x] = null;
        }

        if (session.role == "Manager") {
            // stringify the departments
            var stringDepts = "";
            for (var x in session.dept) {
                stringDepts += session.dept[x].replace(/'/g, "''") + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user.replace(/'/g, "''");
        }

        searchParams = {keywords: null, inTitle: false, inBody: false};
        includeCompleted = "includeCompleted";
        includeExpired = "includeExpired";
        includeArchived = "excludeArchived";
        amount = null;

        // try to post parameters to server to store even after refresh
        $http({method: "POST", url: "/setFilters",
            data: {viewfilters: viewfilters, searchParams: searchParams, includeCompleted: includeCompleted,
                includeExpired: includeExpired, includeArchived: includeArchived, amount: amount},
            headers: {'Content-Type': 'application/json'}})
            .success(function (data) {
                session.filters = data;
                console.log("succeeding reset");
            });
    };

    this.reqTickets = function(session, fromPanel) {
        if (session.role == "Manager" && fromPanel == false) {
            // stringify the departments
            var stringDepts = "";
            for (var x in session.dept) {
                stringDepts += session.dept[x].replace(/'/g, "''") + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
            session.filters.viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user.replace(/'/g, "''");
            session.filters.viewfilters.assignedTo = session.user.replace(/'/g, "''");
        }

        var sessionFilters = session.filters;

        socket.emit('getTicketsView', sessionFilters.viewfilters, sessionFilters.searchParams,
            sessionFilters.includeCompleted, sessionFilters.includeExpired, sessionFilters.includeArchived,
            null, "create_date", "desc");
    };
});

adminModule.controller('ticketController', function($scope, $timeout, $route, $location, $routeParams, $sce) {
    // retrieves ticket information
    // using $routeParams.ticketid and $routeParams.isArchive

    var isArchiveBool = ($routeParams.isArchive === "true");
    console.log("isArchive: " + $routeParams.isArchive + " type: " + typeof(isArchiveBool) );

    socket.emit('getReplies', $routeParams.ticketid, isArchiveBool);

    // error message
    $scope.errorMsg_desc = null;

    $scope.showReply = false;

    // variables pertaining to the editor
    $scope.orightml = '';
    $scope.htmlcontent = $scope.orightml; // ticket body
    $scope.disabled = false;

    $scope.toggleReply = function() {
        if ($scope.showReply == false) {
            $scope.showReply = true;
        } else {
            $scope.showReply = false;
            $scope.htmlcontent = "";
        }
    }

    $scope.submitReply = function() {
        if ($scope.htmlcontent == null) {
            $scope.errorMsg_desc = "Post cannot be left blank.";
            return;
        } else {
            $scope.htmlcontent = $scope.htmlcontent.trim();
            $scope.errorMsg_desc = null;
        }

        socket.emit('setReply', $routeParams.ticketid, isArchiveBool, $scope.session.user.replace(/'/g, "''"), $scope.htmlcontent.replace(/'/g, "''"));

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    socket.emit('getTicket', $routeParams.ticketid, isArchiveBool, false);
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

        $scope.body_htmlSafe =
            $sce.trustAsHtml($scope.body);

        $scope.$apply();
    });

});

adminModule.controller('newticketController', function($scope, $location, $http, $window) {
    $scope.session.lastLogout = "loggedIn";
    $http({method: "POST", url: "/setLoggedIn", headers: {'Content-Type': 'application/json'}})
        .success(function (data) {
            $scope.session.lastLogout = data;
        });

    $scope.errorMsg_title = null;
    $scope.errorMsg_dept = null;
    $scope.errorMsg_priority = null;
    $scope.errorMsg_email = null;
    $scope.errorMsg_desc = null;

    $scope.dept = "Department";
    $scope.priority = "Priority";

    // variables pertaining to the editor
    $scope.orightml = '';
    $scope.htmlcontent = $scope.orightml; // ticket body
    $scope.disabled = false;

    $scope.setDept = function(dept) {
        $scope.dept = dept;
    }

    $scope.setPriority = function(priority) {
        $scope.priority = priority;
    }

    $scope.submit = function() {
        if ($scope.title == null) {
            $scope.errorMsg_title = "Title cannot be left blank.";
            return;
        } else {
            $scope.title = $scope.title.trim();
            if ($scope.title == "") {
                $scope.errorMsg_title = "Title cannot be left blank.";
                $scope.title = null;
                return;
            }
            $scope.errorMsg_title = null;
        }

        if ($scope.dept == "Department") {
            $scope.errorMsg_dept = "Invalid department selected.";
            return;
        } else {
            $scope.errorMsg_dept = null;
        }

        if ($scope.priority == "Priority") {
            $scope.errorMsg_priority = "Invalid priority selected.";
            return;
        } else {
            $scope.errorMsg_priority = null;
        }

        if ($scope.email == null) {
            $scope.errorMsg_email = "Email cannot be left blank.";
            return;
        } else {
            $scope.email = $scope.email.trim()
            if ($scope.email == "") {
                $scope.errorMsg_email = "Email cannot be left blank.";
                $scope.email = null;
                return;
            }
            if ($scope.email.search('@') == -1 ||
                $scope.email[0] == '@' ||
                $scope.email.trim()[$scope.email.length-1] == '@') {
                $scope.errorMsg_email = "Invalid email address.";
                $scope.email = null;
                return;
            }
            // prevents apostrophes in an email address
            if ($scope.email.search("'") != -1) {
                $scope.errorMsg_email = "Invalid email address.";
                $scope.email = null;
                return;
            }
            $scope.errorMsg_email = null;
        }

        if ($scope.htmlcontent == null) {
            $scope.errorMsg_desc = "Ticket description cannot be left blank.";
            return;
        } else {
            $scope.htmlcontent = $scope.htmlcontent.trim();
            $scope.errorMsg_desc = null;
        }

        socket.emit('setTicket',
            null,
            $scope.title.replace(/'/g, "''"),
            $scope.dept.replace(/'/g, "''"),
            $scope.htmlcontent.replace(/'/g, "''"),
            $scope.priority,
            $scope.user.replace(/'/g, "''"),
            $scope.email,
            null, null, null, null, null, null, false, false);

        $window.location = document.URL.replace("/newticket", "") + "/viewtickets";
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
        if ($scope.dept != null) {
            $scope.dept = $scope.dept.replace(/'/g, "''").trim()
        }
        if ($scope.assignedTo != null) {
            $scope.assignedTo = $scope.assignedTo.replace(/'/g, "''").trim()
        }
        if ($scope.alteredBy != null) {
            $scope.alteredBy = $scope.alteredBy.replace(/'/g, "''").trim()
        }
        if ($scope.submittedBy != null) {
            $scope.submittedBy = $scope.submittedBy.replace(/'/g, "''").trim()
        }
        if ($scope.clientEmail != null) {
            $scope.clientEmail = $scope.clientEmail.replace(/'/g, "''").trim()
        }
        if ($scope.keywords != null) {
            $scope.keywords = $scope.keywords.replace(/'/g, "''").trim()
        }

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

adminModule.controller('viewuserController', function($scope, $timeout, $route) {
    socket.emit('getUsers', null);

    $scope.$on("$destroy", function(){
        $scope.eraseErrorMsg();
    });

    $scope.isEdit = null;

    // display carets
    $scope.showCarets = true;

    // error message
    $scope.errorMsg_name = null;

    // edited fields
    $scope.newName = null;
    $scope.newRole = null;

    // headings
    $scope.heading1 = "Name";
    $scope.heading2 = "Email";
    $scope.heading3 = "Role";

    $scope.setRole = function(role) {
        $scope.newRole = role;
    }

    $scope.saveEdits = function() {
        if ($scope.newName == null) {
            $scope.errorMsg_name = "Username cannot be blank.";
            return;
        } else {
            $scope.newName = $scope.newName.trim();
            if ($scope.newName == "") {
                $scope.errorMsg_name = "Username cannot be blank.";
                $scope.newName = null;
                return;
            }

            $scope.errorMsg_name = null;
        }

        socket.emit('setUser', $scope.isEdit, $scope.newName.replace(/'/g, "''"), null, null, $scope.newRole);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    $scope.toggleEdit = function(user) {
        if ($scope.isEdit != user.id) {
            $scope.isEdit = user.id;
            $scope.newName = user.name;
            $scope.newRole = user.type;

            $scope.heading1 = "";
            $scope.heading2 = "";
            $scope.heading3 = "";

            $scope.showCarets = false;
        } else {
            $scope.errorMsg_name = null;

            $scope.isEdit = null;
            $scope.newName = null;
            $scope.newRole = null;

            $scope.heading1 = "Name";
            $scope.heading2 = "Email";
            $scope.heading3 = "Role";

            $scope.showCarets = true;
        }
    }

    $scope.checkIfEdit = function(id) {
        return $scope.isEdit == id;
    }

    $scope.storeDelete = function(id) {
        $scope.id = id;
    }

    $scope.deleteUser = function() {
        socket.emit('deleteUser', $scope.id);

        $timeout(function() {
            $route.reload();
        }, 500);
    }
});

adminModule.controller('newuserController', function($scope, $location) {
    $scope.errorMsg_name = null;
    $scope.errorMsg_email = null;
    $scope.errorMsg_password = null;
    $scope.errorMsg_role = null;

    $scope.role = null;

    $scope.register = function() {
        if ($scope.name == null) {
            $scope.errorMsg_name = "Username cannot be left blank.";
            return;
        } else {
            $scope.name = $scope.name.trim();
            if ($scope.name == "") {
                $scope.errorMsg_name = "Username cannot be left blank.";
                $scope.name = null;
                return;
            }
            $scope.errorMsg_name = null;
        }

        if ($scope.email == null) {
            $scope.errorMsg_email = "Email cannot be left blank.";
            return;
        } else {
            $scope.email = $scope.email.trim();
            if ($scope.email == "") {
                $scope.errorMsg_email = "Email cannot be left blank.";
                $scope.email = null;
                return;
            }
            if ($scope.email.search('@') == -1 ||
                $scope.email[0] == '@' ||
                $scope.email.trim()[$scope.email.length-1] == '@') {
                $scope.errorMsg_email = "Invalid email address.";
                $scope.email = null;
                return;
            }
            // prevents apostrophes in an email address
            if ($scope.email.search("'") != -1) {
                $scope.errorMsg_email = "Invalid email address.";
                $scope.email = null;
                return;
            }
            $scope.errorMsg_email = null;
        }

        if ($scope.password == null || $scope.cpassword == null) {
            $scope.errorMsg_password = "Password cannot be left blank.";
            return;
        } else {
            if ($scope.password.trim() == "" || $scope.cpassword.trim() == "") {
                $scope.errorMsg_password = "Password cannot be left blank.";
                $scope.password = null;
                $scope.cpassword = null;
                return;
            } else if ($scope.password != $scope.cpassword) {
                $scope.errorMsg_password = "Passwords do not match.";
                $scope.password = null;
                $scope.cpassword = null;
                return;
            } else {
                $scope.errorMsg_password = null;
            }
        }

        if ($scope.role == null) {
            $scope.errorMsg_role = "Invalid permission selected.";
            return;
        }

        socket.emit('setUser', null, $scope.name.replace(/'/g, "''"), $scope.email, $scope.password.replace(/'/g, "''"), $scope.role);
        $location.path('/viewusers');
    }
});

adminModule.controller('viewdeptController', function($scope, $route, $timeout, $http) {
    socket.emit('getDepts');

    $scope.$on("$destroy", function(){
        $scope.eraseErrorMsg();
    });

    // error message
    $scope.errorMsg_users = null;
    $scope.errorMsg_name = null;

    $scope.isEdit = null;
    $scope.oldName = null;

    // edited fields
    $scope.newName = null;
    $scope.addUsers = [];
    $scope.delUsers = [];
    $scope.newUser = null;

    // original list of users
    $scope.initialUsers = [];

    // temporary list of users that can be added to or removed from
    // resets upon toggling edit
    $scope.tempUsers = [];

    // headings
    $scope.heading1 = "Dept. Name";
    $scope.heading2 = "Managers";

    $scope.saveEdits = function() {
        $scope.errorMsg_users = null;
        $scope.errorMsg_name = null;

        if ($scope.newName == null) {
            $scope.errorMsg_name = "Department name cannot be left blank.";
            return;
        } else {
            $scope.newName = $scope.newName.trim();
            if ($scope.newName == "") {
                $scope.errorMsg_name = "Department name cannot be left blank.";
                $scope.newName = null;
                return;
            } else {
                $scope.errorMsg_name = null;
            }
        }

        // modify session
        if ($scope.oldName != $scope.newName) {
            $scope.session.dept[$scope.session.dept.indexOf($scope.oldName)] = $scope.newName;
        }

        $scope.addUserStr = "";
        $scope.delUserStr = "";

        if ($scope.addUsers != null) {
            for (var i in $scope.addUsers) {
                $scope.addUserStr += $scope.addUsers[i].replace(/'/g, "''") + " ";
            }
            $scope.addUserStr = $scope.addUserStr.trim();
        }

        if ($scope.delUsers != null) {
            for (var j in $scope.delUsers) {
                $scope.delUserStr += $scope.delUsers[j].replace(/'/g, "''") + " ";
            }
            $scope.delUserStr = $scope.delUserStr.trim();
        }

        $scope.addUserStr = ($scope.addUserStr == "" ? null : $scope.addUserStr);
        $scope.delUserStr = ($scope.delUserStr == "" ? null : $scope.delUserStr);

        console.log("isEdit: " + $scope.isEdit);
        console.log("addUsers: " + $scope.addUsers);
        console.log("delUsers: " + $scope.delUsers);
        console.log("addUsersStr: " + $scope.addUserStr);
        console.log("delUsersStr: " + $scope.delUserStr);

        socket.emit('setDept', $scope.isEdit, $scope.newName.replace(/'/g, "''"), $scope.addUserStr, $scope.delUserStr);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    $scope.toggleEdit = function(dept) {
        if ($scope.isEdit != dept.id) {
            $scope.errorMsg_users = null;
            $scope.errorMsg_name = null;

            $scope.isEdit = dept.id;
            $scope.oldName = dept.name;
            $scope.newName = dept.name;

            $scope.addUsers = [];
            $scope.delUsers = [];
            $scope.newUser = null;

            $scope.initialUsers = [];
            $scope.tempUsers = [];

            $scope.initialUsers = dept.managers;
            for (var x in dept.managers) {
                $scope.tempUsers.push(dept.managers[x]);
            }

            $scope.heading1 = "";
            $scope.heading2 = "";
        } else {
            $scope.errorMsg_users = null;
            $scope.errorMsg_name = null;

            $scope.isEdit = null;
            $scope.oldName = null;
            $scope.newName = null;
            $scope.addUsers = [];
            $scope.delUsers = [];
            $scope.newUser = null;

            $scope.initialUsers = [];
            $scope.tempUsers = [];

            $scope.heading1 = "Dept. Name";
            $scope.heading2 = "Managers";
        }
    }

    $scope.checkIfEdit = function(id) {
        return $scope.isEdit == id;
    }

    $scope.addToUsers = function(username) {
        $scope.errorMsg_name = null;

        if (username == null) {
            $scope.errorMsg_users = "Username cannot be left blank.";
            return;
        } else {
            username = username.trim();
            if (username == "") {
                $scope.errorMsg_users = "Username cannot be left blank.";
                return;
            }
            $scope.errorMsg_users = null;
        }

        // if username wasn't in the initial list, add it
        // otherwise, it's sufficient to remove it from the "delUsers" array
        if ($scope.initialUsers.indexOf(username) == -1) {
            var temp = "";

            // if multi-word username, encase in double-quotes
            if (username.split(" ").length > 1)
                temp = "\"" + username + "\"";
            else
                temp = username;
                $scope.addUsers.push(temp);
        }
        // if not already displayed in the list, display the username
        if ($scope.tempUsers.indexOf(username) == -1) {
            if ($scope.tempUsers[0] == '') {
                $scope.tempUsers[0] = username;
            } else {
                $scope.tempUsers.push(username);
            }
        } else {
            $scope.errorMsg_users = "Manager is already assigned to this department.";
            $scope.newUser = null;
            return;
        }

        $scope.delUsers.splice($scope.delUsers.indexOf(username), 1);
        $scope.newUser = null;
    }

    $scope.delFromUsers = function(username) {
        if (username == null) {
            $scope.errorMsg_users = "Username cannot be left blank.";
            return;
        } else {
            $scope.errorMsg_users = null;
        }

        var temp = "";
        if (username.split(" ").length > 1)
            temp = "\"" + username + "\"";
        else
            temp = username;

        $scope.tempUsers.splice($scope.tempUsers.indexOf(username), 1);

        // if added to addUsers (i.e. not in original list) simply remove from addUsers
        if ($scope.addUsers.indexOf(temp) != -1) {
            $scope.addUsers.splice($scope.addUsers.indexOf(temp), 1);
        } else {
            $scope.delUsers.push(temp);
        }
    }

    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'table-cell';
    }

    $scope.stringifyUsers = function(users) {
        var list = "";
        for (var i = 0; i < users.length; i++) {
            list += users[i];
            if (i != users.length-1)
                list += ", ";
        }

        return list;
    }

    $scope.storeDelete = function(id, name) {
        $scope.id = id;
        $scope.name = name;
    }

    $scope.deleteDept = function() {
        socket.emit('deleteDept', $scope.id);

        $scope.session.dept.splice($scope.session.dept.indexOf($scope.name), 1);

        $http({method: "POST", url: "/delDept", headers: {'Content-Type': 'application/json'},
            data: {deptName: $scope.name}})
            .success(function (data) {
                $scope.session.dept = data;

                $timeout(function() {
                    $route.reload();
                }, 500);
            });
    }
});

adminModule.controller('newdeptController', function($scope, $location, $http) {
    $scope.errorMsg_name = null;

    $scope.create = function() {
        if ($scope.deptname == null) {
            $scope.errorMsg_name = "Department name cannot be left blank.";
            return;
        } else {
            $scope.deptname = $scope.deptname.trim();
            if ($scope.deptname == "") {
                $scope.errorMsg_name = "Department name cannot be left blank";
                $scope.deptname = null;
                return;
            }
            if ($scope.deptname.search("'") != -1) {
                $scope.errorMsg_name = "Invalid department name";
                $scope.deptname = null;
                return;
            }
            $scope.errorMsg_name = null;
        }

        if ($scope.managers != null) {
            $scope.managerArray = $scope.managers.split(" ");
            $scope.managerEsc = "";

            for (var x in $scope.managerArray) {
                $scope.managerEsc += $scope.managerArray[x].replace(/'/g, "''") + " ";
            }
            $scope.managerEsc = $scope.managerEsc.trim();
        }

        $scope.session.dept.push($scope.deptname);
        $scope.deptnameEsc = $scope.deptname.replace(/'/g, "''");

        socket.emit('setDept', null, $scope.deptnameEsc, $scope.managerEsc, null);

        $http({method: "POST", url: "/addDept", headers: {'Content-Type': 'application/json'},
            data: {newDept: $scope.deptname}})
            .success(function (data) {
                $scope.session.dept = data;
                $location.path('/viewdepts');
            });
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
                stringDepts += scope.session.dept[x].replace(/'/g, "''") + " ";
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
                    assignedTo: scope.session.user.replace(/'/g, "''"), alteredBy: null, dateCreated: null, dateAltered: null};
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

adminModule.directive('loginTickets', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayTicketsLogout', function(ticketList) {
                scope.lastLogout.ticketList = ticketList;
                scope.lastLogout.numberOfTickets = ticketList.length;
                scope.$apply();
            });
        }
    }
});

adminModule.directive('assignedTickets', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayTicketsView', function(ticketList) {
                scope.assignedTickets.ticketList = ticketList;
                scope.assignedTickets.numberOfTickets = ticketList.length;
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
                if (ticketList.length == 0) {
                    scope.noTickets = "Your search did not find any results.";
                }
                scope.maintickets = ticketList;

                // for pagination

                scope.currentPage = 0;
                scope.pageSize = 10;
                scope.numberOfPages=function(){
                    return Math.ceil(scope.maintickets.length/scope.pageSize);
                }

                scope.$apply();
            });

            socket.on('newTicket', function(newid) {
                socket.emit('getTicket', newid, false, false);
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

                // for pagination

                scope.currentPage = 0;
                scope.pageSize = 10;
                scope.numberOfPages=function(){
                    return Math.ceil(scope.mainusers.length/scope.pageSize);
                }

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
                    scope.user = scope.session.user.replace(/'/g, "''");
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

adminModule.directive('ticketReplies', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayReplies', function(replyList) {
                scope.replies = replyList;
                scope.$apply();
            });

            $('#toggleReply').on('click', function() {
                $('html, body').animate({
                    scrollTop: $("#replyForm").offset().top - 65
                }, 250);
            });
        }
    }
});

// for pagination

adminModule.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (input)
            return input.slice(start);
    }
});