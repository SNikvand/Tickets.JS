var mainList;
var expiredList;
var dueList;

function initializeAdmin() {
    var mainFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
    var expiredFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};
    var dueFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};

    // get full list
    socket.emit('getTickets', mainFilters, null, "include", "exclude", 5);
    socket.on('displayTickets', function(ticketList) {

    });
}

$(document).ready(function() {
    $('#welcomeUser').html('Welcome, ' + sessionUser + '!');

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