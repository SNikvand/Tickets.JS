var clientModule = angular.module('client', ['ngRoute', 'textAngular']);


//routing configuration for the portal page.
clientModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/newticket', { // default route
            templateUrl: '/partials/client/newticket.html',
            controller: 'newticketController'
        })
        .when('/viewticket/ticket/:ticketid', {
            templateUrl: '/partials/client/viewticket.html',
            controller: 'viewticketController'
        })
        .otherwise({      // redirect if improper route entered.
            redirectTo: '/newticket'
        });
});


clientModule.controller('newticketController', function($scope, $location, $http) {
    // error messages
    // these display underneath the form fields and appear when appropriate
    $scope.errorMsg_firstname = null;
    $scope.errorMsg_lastname = null;
    $scope.errorMsg_email = null;
    $scope.errorMsg_dept = null;
    $scope.errorMsg_priority = null;
    $scope.errorMsg_title = null;
    $scope.errorMsg_desc = null;

    // form field model variables
    $scope.firstname;
    $scope.lastname;
    $scope.email;
    $scope.dept = "Department";   // default value before user selects dropdown
    $scope.priority = "Priority"; // default value before user selects dropdown
    $scope.title;

    // variables pertaining to the editor
    $scope.orightml = '';
    $scope.htmlcontent = $scope.orightml; // ticket body
    $scope.disabled = false;

    // user selects a department from the dropdown
    $scope.setDept = function(dept) {
        $scope.dept = dept;
    }

    // user selects a priority from the dropdown
    $scope.setPriority = function(priority) {
        $scope.priority = priority;
    }

    // when submit is pressed sends the data in the fields
    $scope.submit = function() {
        // error-handling for the form fields
        if ($scope.title == null) {
            $scope.errorMsg_title = "Title cannot be left blank.";
            return;
        } else {
            // if there are unnecessary spaces before or after the input
            if ($scope.title.trim() == "") {
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

        if ($scope.firstname == null) {
            $scope.errorMsg_firstname = "First name cannot be left blank.";
            return;
        } else {
            // if there are unnecessary spaces before or after the input
            if ($scope.firstname.trim() == "") {
                $scope.errorMsg_firstname = "First name cannot be left blank.";
                $scope.firstname = null;
                return;
            }
            $scope.errorMsg_firstname = null;
        }

        if ($scope.lastname == null) {
            $scope.errorMsg_lastname = "Last name cannot be left blank.";
            return;
        } else {
            // if there are unnecessary spaces before or after the input
            if ($scope.lastname.trim() == "") {
                $scope.errorMsg_lastname = "Last name cannot be left blank.";
                $scope.lastname = null;
                return;
            }
            $scope.errorMsg_lastname = null;
        }

        if ($scope.email == null) {
            $scope.errorMsg_email = "Email cannot be left blank.";
            return;
        } else {
            // if there are unnecessary spaces before or after the input
            if ($scope.email.trim() == "") {
                $scope.errorMsg_email = "Email cannot be left blank.";
                $scope.email = null;
                return;
            }
            // if the email doesn't have an '@' symbol somewhere
            // also for cases where '@' is the first or last character
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

        // combine first and last names
        $scope.fullname = $scope.firstname + " " + $scope.lastname;

        console.log("body: " + $scope.htmlcontent);

        // automatically escapes any apostrophes found by doubling them
        socket.emit('setTicket', null,
            $scope.title.replace(/'/g, "''"),
            $scope.dept,
            $scope.htmlcontent.replace(/'/g, "''"),
            $scope.priority,
            $scope.fullname.replace(/'/g, "''"),
            $scope.email,
            null, null, null, null, null, null, false, true);

        //$location.path('/viewticket'); // routes to a view of the newly created ticket.

        socket.on('clientHash', function(hash) {
            $location.path('/viewticket/ticket/' + hash);
        });
    }

    // fetches the full list of departments to display in the dropdown
    $http({method: "GET", url: "/getDepts", headers: {'Content-Type': 'application/json'}})
        .success(function (data) {
            $scope.departments = data;
            console.log("depts: " + JSON.stringify($scope.departments));
        });
});


clientModule.controller('viewticketController', function($scope, $timeout, $route, $location, $routeParams) {
    // retrieves ticket information
    // using $routeParams.ticketid and $routeParams.isArchive

    socket.emit('getReplies', $routeParams.ticketid, false);

    // error message
    $scope.errorMsg_desc = null;

    $scope.showReply = false;
    $scope.replyDesc = "";

    $scope.toggleReply = function() {
        if ($scope.showReply == false) {
            $scope.showReply = true;
        } else {
            $scope.showReply = false;
            $scope.replyDesc = "";
        }
    }

    $scope.submitReply = function() {
        if ($scope.replyDesc == null) {
            $scope.errorMsg_desc = "Post cannot be left blank.";
            return;
        } else {
            if ($scope.replyDesc.trim() == "") {
                $scope.errorMsg_desc = "Post cannot be left blank.";
                $scope.replyDesc = null;
                return;
            }
            $scope.errorMsg_desc = null;
        }

        socket.emit('setReply', $routeParams.ticketid, false, null, $scope.replyDesc);

        $timeout(function() {
            $route.reload();
        }, 500);
    }

    socket.emit('getTicket', $routeParams.ticketid, null, true);
    socket.on('notClient', function() {
        $scope.isClient = false;
        $scope.$apply();
    });
    socket.on('displayTicket', function(hash, title, department, description, priority, author, author_email, assigned_to, altered_by,
                                        create_date, due_date, altered_date, complete_date) {

        $scope.isClient = true;

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

clientModule.directive('ticketReplies', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            socket.on('displayReplies', function(replyList) {
                console.log("replies: " + JSON.stringify(replyList));
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