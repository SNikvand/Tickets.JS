var mainList;
var expiredList;
var dueList;

function initializeAdmin() {
    // DATABASE FUNCTION: number of new tickets should somehow be fetched from database
    $('#newTickets').html('New tickets since last login: <a href="#">10</a>');
    $('#newTickets').css('display', 'block');

    // DATABASE FUNCTION: number of total tickets should also be fetched from database
    $('#totalTickets').html('Total number of tickets: <a href="#">600</a>');
    $('#totalTickets').css('display', 'block');

    $('#adminHome').css('display', 'block');

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

function initializeManager() {
    // DATABASE FUNCTION: number of new tickets for this user's departments
    $('#newTickets').html('New tickets in your departments since last login: <a href="#">10</a>');
    $('#newTickets').css('display', 'block');

    // DATABASE FUNCTION: number of total tickets fetched for this user's departments
    $('#totalTickets').html('Total tickets in your departments: <a href="#">32</a>');
    $('#totalTickets').css('display', 'block');

    $('#managerHome').css('display', 'block');
}

function initializeITUser() {
    // DATABASE FUNCTION: number of newly assigned tickets for this user
    $('#newAssigned').html('New ticket assignments since last login: <a href="#">1</a>');
    $('#newAssigned').css('display', 'block');

    // DATABASE FUNCTION: total number of assigned tickets for this user
    $('#totalAssigned').html('Total number of assignments: <a href="#">5</a>');
    $('#totalAssigned').css('display', 'block');

    $('#itUserHome').css('display', 'block');
}

$(document).ready(function() {
    $('#welcomeUser').html('Welcome back, ' + sessionUser + '!');

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