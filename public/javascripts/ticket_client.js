var socket = io.connect();

/*var mainList;
var expiredList;
var dueList;

function initializeAdmin() {
    var mainFilters = {user: null, dept: null, priority: null, email: null};
    var expiredFilters = {user: null, dept: null, priority: null, email: null};
    var dueFilters = {user: null, dept: null, priority: null, email: null};

    // get full list
    socket.emit('getTickets', mainFilters, null, 1);
    socket.on('displayTickets', function(ticketList) {

    });
}*/

$(document).ready(function() {
    switch (sessionRole) {
        case "IT User":
            initializeITUser();
            break;
        case "Manager":
            initializeManager();
            break;
        case "Admin":
            initializeAdmin();
            break;
        default:
            console.log("error: forbidden");
            // this should never happen, but if it does, redirect back to index login page
    }
});