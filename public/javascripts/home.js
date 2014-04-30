var mainList;
var expiredList;
var dueList;

function generateList(ticketList) {
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
}

function initializeAdmin() {
    // DATABASE FUNCTION: number of new tickets should somehow be fetched from database
    $('#newTickets').html('New tickets since last login: <a href="#">10</a>');
    $('#newTickets').css('display', 'block');

    // DATABASE FUNCTION: number of total tickets should also be fetched from database
    $('#totalTickets').html('Total number of tickets: <a href="#">600</a>');
    $('#totalTickets').css('display', 'block');

    $('#adminHome').css('display', 'block');

    var noFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};

    // get main list
    socket.emit('getTicketsAdmin3', noFilters, null, "include", "exclude", 5);
    socket.on('displayTicketsAdmin3', function(ticketList) {
        $('#admin3').append(generateList(ticketList));
    });

    // get expired list
    socket.emit('getTicketsAdmin2', noFilters, null, "exclude", "only", 5);
    socket.on('displayTicketsAdmin2', function(ticketList) {
        $('#admin2').append(generateList(ticketList));
    });

    // get soon-to-expire list
    socket.emit('getTicketsAdmin1', noFilters, null, "exclude", "exclude", 5);
    socket.on('displayTicketsAdmin1', function(ticketList) {
        $('#admin1').append(generateList(ticketList));
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

    var deptFilters = {dept: sessionDepts, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: null, alteredBy: null, dateCreated: null, dateAltered: null};

    // get main list
    socket.emit('getTicketsManager3', deptFilters, null, "include", "exclude", 5);
    socket.on('displayTicketsManager3', function(ticketList) {
        $('#manager3').append(generateList(ticketList));
    });

    // get expired list
    socket.emit('getTicketsManager2', deptFilters, null, "exclude", "only", 5);
    socket.on('displayTicketsManager2', function(ticketList) {
        $('#manager2').append(generateList(ticketList));
    });

    // get soon-to-expire list
    socket.emit('getTicketsManager1', deptFilters, null, "exclude", "exclude", 5);
    socket.on('displayTicketsManager1', function(ticketList) {
        $('#manager1').append(generateList(ticketList));
    });
}

function initializeITUser() {
    // DATABASE FUNCTION: number of newly assigned tickets for this user
    $('#newAssigned').html('New ticket assignments since last login: <a href="#">1</a>');
    $('#newAssigned').css('display', 'block');

    // DATABASE FUNCTION: total number of assigned tickets for this user
    $('#totalAssigned').html('Total number of assignments: <a href="#">5</a>');
    $('#totalAssigned').css('display', 'block');

    $('#ituserHome').css('display', 'block');

    var itFilters = {dept: null, priority: null, submittedBy: null, clientEmail: null,
        assignedTo: sessionUser, alteredBy: null, dateCreated: null, dateAltered: null};

    // get assigned list
    socket.emit('getTicketsITUser3', itFilters, null, "include", "exclude", 5);
    socket.on('displayTicketsITUser3', function(ticketList) {
        $('#ituser3').append(generateList(ticketList));
    });

    // get expired list
    socket.emit('getTicketsITUser2', itFilters, null, "exclude", "only", 5);
    socket.on('displayTicketsITUser2', function(ticketList) {
        $('#ituser2').append(generateList(ticketList));
    });

    // get soon-to-expire list
    socket.emit('getTicketsITUser1', itFilters, null, "exclude", "exclude", 5);
    socket.on('displayTicketsITUser1', function(ticketList) {
        $('#ituser1').append(generateList(ticketList));
    });
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