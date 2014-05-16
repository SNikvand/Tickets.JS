var clientModule = angular.module('client', ['ngRoute', 'textAngular']);


//routing configuration for the portal page.
clientModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/newticket', { // default route
            templateUrl: '/partials/client/newticket.html',
            controller: 'newticketController'
        })
        .when('/viewticket/:userhash/:tickethash', {
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
            $scope.title = $scope.title.replace(/'/g, "''"),
            $scope.dept,
            $scope.htmlContent = $scope.htmlcontent.replace(/'/g, "''"),
            $scope.priority,
            $scope.fullname.replace(/'/g, "''"),
            $scope.email,
            null, null, null, null, null, null, false);

        $location.path('/viewticket'); // routes to a view of the newly created ticket.
    }

    // fetches the full list of departments to display in the dropdown
    $http({method: "GET", url: "/getDepts", headers: {'Content-Type': 'application/json'}})
        .success(function (data) {
            $scope.departments = data;
            console.log("depts: " + JSON.stringify($scope.departments));
        });
});


clientModule.controller('viewticketController', function($scope) {

});