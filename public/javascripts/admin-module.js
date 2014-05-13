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
            controller: 'viewticketsDeptController',
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
        /*.when('/replyticket', {
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
        })*/
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
        //$location.path('/viewtickets');
    };

    $scope.resetViewParams = function() {
        console.log("panel test: " + JSON.stringify($scope.session));
        ticketParams.resetParams($scope.session);
    }
});

adminModule.controller('overviewController', function($scope, $location) {
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
        stringDepts += $scope.session.dept[x] + " ";
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
            assignedTo: $scope.session.user, alteredBy: null, dateCreated: null, dateAltered: null, lastLogout: lastLogout};
    }

    $scope.lastLogout = {numberOfTickets: null, ticketList: null};
    $scope.assignedTickets = {numberOfTickets: null, ticketList: null};

    socket.emit('getTicketsLogout', defFilters, searchParams, 'includeCompleted', 'includeExpired', 'includeArchived', null, "create_date", "desc");
    socket.emit('getTicketsView', defFilters, searchParams, 'excludeCompleted', 'includeExpired', 'excludeArchived', null, "create_date", "desc");

    $scope.toggleLoginTickets = function() {
        if ($scope.showLoginTickets == false) {
            $scope.showLoginTickets = true;
            $scope.showAssignedTickets = false;
            $scope.session.lastLogout = "loggedIn";
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

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'inline';
    }

    $scope.isEdit = null;
    $scope.isEditArchive = null;

    // edited fields
    $scope.newPriority = null;
    $scope.newDept = null;
    $scope.newAssignedTo = null;
    $scope.isCompleted = false;
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
        console.log("isEdit: " + $scope.isEdit);
        console.log("isEditArchive: " + $scope.isEditArchive);

        socket.emit('setTicket', $scope.isEdit, null, $scope.newDept, null, $scope.newPriority, null, null,
            $scope.newAssignedTo, $scope.alteredBy, null, null, null, $scope.isCompleted, $scope.isEditArchive);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    $scope.toggleEdit = function(ticket) {
        if ($scope.isEdit != ticket.hash || $scope.isEditArchive != ticket.isArchive) {
            $scope.isEdit = ticket.hash;
            $scope.isEditArchive = ticket.isArchive;
            $scope.newPriority = ticket.priority;
            $scope.newDept = ticket.department;
            $scope.newAssignedTo = ticket.assigned_to;
            $scope.isCompleted = (ticket.complete_date != null);

            console.log("is completed: " + $scope.isCompleted);

            $scope.heading1 = "";
            $scope.heading2 = "";
            $scope.heading3 = "";
            $scope.heading4 = "";
            $scope.heading5 = "";
            $scope.heading6 = "";
        } else {
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

adminModule.controller('viewticketsDeptController', function($scope, $location, $route, $routeParams, ticketParams) {
    ticketParams.reqTickets($scope.session, true);

    $scope.newtickets = [];
    if ($scope.session.role == "IT User") {
        $scope.displayProp = 'none';
    } else {
        $scope.displayProp = 'inline';
    }

    $scope.isEdit = null;
    $scope.isEditArchive = null;

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
        socket.emit('setTicket', $scope.isEdit, null, $scope.newDept, null, $scope.newPriority, null, null,
            $scope.newAssignedTo, $scope.alteredBy, null, null, null, $scope.isCompleted, $scope.isEditArchive);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    $scope.toggleEdit = function(ticket) {
        console.log("isEdit: " + $scope.isEdit);
        console.log("isEditArchive: " + $scope.isEditArchive);
        console.log("currently editing: " + ticket.hash);
        console.log("is archive: " + ticket.isArchive);
        console.log("is completed: " + ticket.complete_date);

        if ($scope.isEdit != ticket.hash || $scope.isEditArchive != ticket.isArchive) {
            $scope.isEdit = ticket.hash;
            $scope.isEditArchive = ticket.isArchive;
            $scope.newPriority = ticket.priority;
            $scope.newDept = ticket.department;
            $scope.newAssignedTo = ticket.assigned_to;
            $scope.isCompleted = (ticket.complete_date != null ? true : false);

            $scope.heading1 = "";
            $scope.heading2 = "";
            $scope.heading3 = "";
            $scope.heading4 = "";
            $scope.heading5 = "";
            $scope.heading6 = "";
        } else {
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
                stringDepts += session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user;
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
                stringDepts += session.dept[x] + " ";
            }
            stringDepts = stringDepts.trim();

            viewfilters.dept = stringDepts;
            session.filters.viewfilters.dept = stringDepts;
        } else if (session.role == "IT User") {
            viewfilters.assignedTo = session.user;
            session.filters.viewfilters.assignedTo = session.user;
        }

        var sessionFilters = session.filters;
        console.log("session filters: " + JSON.stringify(session.filters));

        socket.emit('getTicketsView', sessionFilters.viewfilters, sessionFilters.searchParams,
            sessionFilters.includeCompleted, sessionFilters.includeExpired, sessionFilters.includeArchived,
            null, "create_date", "desc");
    };
});

adminModule.controller('ticketController', function($scope, $timeout, $route, $location, $routeParams) {
    // retrieves ticket information
    // using $routeParams.ticketid and $routeParams.isArchive

    socket.emit('getReplies', $routeParams.ticketid, $routeParams.isArchive);

    $scope.showReply = false;
    $scope.replyDesc = "";

    $scope.toggleReply = function() {
        if ($scope.showReply == false) {
            $scope.showReply = true;
        } else {
            $scope.showReply = false;
        }
    }

    $scope.submitReply = function() {
        console.log("desc: " + $scope.replyDesc);
        console.log("id: " + $routeParams.ticketid);
        console.log("isArchive: " + $routeParams.isArchive);

        socket.emit('setReply', $routeParams.ticketid, $routeParams.isArchive, $scope.session.user, $scope.replyDesc);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

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
    $scope.session.lastLogout = "loggedIn";
    console.log("logout time: " + $scope.session.lastLogout);
    console.log("depts: " + $scope.session.dept);

    $scope.dept = "Department";
    $scope.priority = "Priority";

    $scope.setDept = function(dept) {
        $scope.dept = dept;
    }

    $scope.setPriority = function(priority) {
        $scope.priority = priority;
    }

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

adminModule.controller('viewuserController', function($scope, $timeout, $route) {
    socket.emit('getUsers', null);
    $scope.isEdit = null;

    // edited fields
    $scope.newName = null;
    $scope.newRole = null;

    // headings
    $scope.heading1 = "Name";
    $scope.heading2 = "Email";
    $scope.heading3 = "Password";
    $scope.heading4 = "Role";

    $scope.setRole = function(role) {
        $scope.newRole = role;
    }

    $scope.saveEdits = function() {
        socket.emit('setUser', $scope.isEdit, $scope.newName, null, null, $scope.newRole);

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
            $scope.heading4 = "";
        } else {
            $scope.isEdit = null;
            $scope.newName = null;
            $scope.newRole = null;

            $scope.heading1 = "Name";
            $scope.heading2 = "Email";
            $scope.heading3 = "Password";
            $scope.heading4 = "Role";
        }

        console.log("currently editing: " + $scope.isEdit);
        console.log("new name: " + $scope.newName);
        console.log("new role: " + $scope.newRole);
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
    $scope.register = function() {
        socket.emit('setUser', null, $scope.name, $scope.email, $scope.password, $scope.role);
        $location.path('/viewusers');
    }
});

adminModule.controller('viewdeptController', function($scope, $timeout, $route) {
    socket.emit('getDepts');

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

        $timeout(function() {
            $route.reload();
        }, 500);
    }
});

adminModule.controller('newdeptController', function($scope, $location) {
    $scope.deptname = "Department";

    $scope.setDept = function(dept) {
        $scope.deptname = dept;
    }

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

adminModule.directive('loginTickets', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayTicketsLogout', function(ticketList) {
                console.log("login tickets: " + JSON.stringify(ticketList));
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

adminModule.directive('ticketReplies', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            $('#toggleReply').on('click', function() {
                $('html, body').animate({
                    scrollTop: $("#replyForm").offset().top - 65
                }, 250);
            });

            socket.on('displayReplies', function(replyList) {
                scope.replies = replyList;
            });
        }
    }
});