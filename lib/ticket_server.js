var socketio = require('socket.io');
var io;
var dbConfig = config.db;
var async = require('async');
var mail = require('./mailClient');

exports.listen = function(server) {
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
        handleSetTicket(socket);
        handleGetTicket(socket);
        handleGetTickets(socket);

        handleSetUser(socket);
        handleGetUser(socket);
        handleGetUsers(socket);

        handleSetDept(socket);
        handleGetDepts(socket);

        handleSetReply(socket);
        handleGetReplies(socket);
    });
};

/*
    purpose: called when either a client submits a new ticket, or an admin/manager
    edits a ticket. if 'id' is null, then this is a new ticket.

    author: Matthew Chan

    date: 04/29/2014
 */
function handleSetTicket(socket) {
    socket.on('setTicket', function(id, title, dept, description, priority, submittedBy, clientEmail,
        assignedTo, alteredBy, dateCreated, dateDue, dateAltered, dateCompleted) {
        if (id == null) {
            // this is a new ticket

            // DATABASE FUNCTION: store parameters into new ticket
            // dateCreated and dateDue are automatically generated
            // assignedTo, alteredBy, dateAltered and dateCompleted are null

            var newid = ''; // a new md5 id to be retrieved from the database
            socket.emit('newTicket', newid); // lets the client know that a new ticket has been created
        } else {
            // this is an existing ticket

            // ERROR HANDLING: check if ticket exists in database
            /* if (checkTicketExists(ticketId) == false) {
                   break from this function, and do nothing
               }
            */

            // DATABASE FUNCTION: store parameters into existing ticket
            // dateAltered is automatically generated
            // submittedBy, clientEmail, and dateCreated are unchanged
        }
    });
}

/*
    purpose: called when a specific ticket is requested from the database for
    viewing by the client (for admin, manager or IT user).

    author: Matthew Chan

    date: 04/28/2014
 */
function handleGetTicket(socket) {
    socket.on('getTicket', function(id) {
        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(id) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: retrieve data for the ticket marked 'id'

        //socket.emit('displayTicket', title, dept, description, priority, submittedBy, clientEmail,
        //    assignedTo, alteredBy, dateCreated, dateDue, dateAltered, dateCompleted);
    });
}

/*
    purpose: when the client requests a list of tickets to display, this function
    factors in the selected filtering options and search parameters to retrieve
    and return the desired rows from the database.

    author: Matthew Chan

    date: 04/29/2014
 */
function handleGetTickets(socket) {
    socket.on('getTicketsAdmin1', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin1")
    });
    socket.on('getTicketsAdmin2', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin2")
    });
    socket.on('getTicketsAdmin3', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin3")
    });
    
    socket.on('getTicketsManager1', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager1")
    });
    socket.on('getTicketsManager2', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager2")
    });
    socket.on('getTicketsManager3', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager3")
    });

    socket.on('getTicketsITUser1', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser1")
    });
    socket.on('getTicketsITUser2', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser2")
    });
    socket.on('getTicketsITUser3', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser3")
    });

    socket.on('getTicketsView', function(filters, searchParams, includeCompleted, includeExpired, amount) {
        emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, "view")
    });
}

function emitTicketList(filters, searchParams, includeCompleted, includeExpired, amount, socket, type) {
    if (filters.length < 1) {
        console.log('error: invalid filter parameters');
    } else {
        // can't request only completed tickets and include expired tickets in the query
        // by definition, completed tickets cannot be expired
        // vice versa
        if (includeCompleted == "only") {
            includeExpired = "exclude";
        } else if (includeExpired == "only") {
            includeCompleted = "exclude";
        }

        // DATABASE FUNCTION: get list of tickets based on filter options/search params
        // var ticketList = getTickets(filters, searchParams, includeExpired);
        // also sends back md5-hashed ticket ids (to use in retrieval of individual tickets)

        // placeholder data to be sent
        var ticketList = [
            {id: 1, title: "Test Ticket 1", dept: "Finance", priority: 5, assignedTo: "Mike",
                dateCreated: "04/30/2014, 12:31 pm", dateAltered: null},
            {id: 2, title: "Test Ticket 2", dept: "Records", priority: 4, assignedTo: "Willow",
                dateCreated: "04/28/2014, 11:22 am", dateAltered: "04/29/2014, 3:00 pm"},
            {id: 3, title: "Test Ticket 3", dept: "Sales & Marketing", priority: 3, assignedTo: "Jesus",
                dateCreated: "04/26/2014, 8:14 am", dateAltered: "04/27/2014, 1:23 pm"},
            {id: 4, title: "Test Ticket 4", dept: "Technical Support", priority: 2, assignedTo: "Katy",
                dateCreated: "04/25/2014, 5:44 pm", dateAltered: null},
            {id: 5, title: "Test Ticket 5", dept: "Management", priority: 1, assignedTo: "Nathan",
                dateCreated: "04/30/2014, 6:17 pm", dateAltered: null}
        ]

        switch (type) {
            case "admin1":
                socket.emit('displayTicketsAdmin1', ticketList);
                break;
            case "admin2":
                socket.emit('displayTicketsAdmin2', ticketList);
                break;
            case "admin3":
                socket.emit('displayTicketsAdmin3', ticketList);
                break;
            case "manager1":
                socket.emit('displayTicketsManager1', ticketList);
                break;
            case "manager2":
                socket.emit('displayTicketsManager2', ticketList);
                break;
            case "manager3":
                socket.emit('displayTicketsManager3', ticketList);
                break;
            case "ituser1":
                socket.emit('displayTicketsITUser1', ticketList);
                break;
            case "ituser2":
                socket.emit('displayTicketsITUser2', ticketList);
                break;
            case "ituser3":
                socket.emit('displayTicketsITUser3', ticketList);
                break;
            case "view":
                socket.emit('displayTicketsView', ticketList);
                break;
            default:
                console.log("error: no 'get tickets' message type specified");
        }
    }
}

/*
    purpose: sorts a json object of tickets based on given parameters, then emits the sorted
    list back to the client through the "displayTickets" message

    EDIT: should be moved to client side instead, because client side should do the sorting.

    author: Matthew Chan

    date: 04/29/2014
 */
/*
function handleSortTickets(socket) {
    socket.on('sortTickets', function(ticketList, type, order) {
        if (type == "user" || type == "dept" || type == "email" || type == "title") {
            ticketList.sort(function (a, b) {
                if (order == "ascending") {
                    if (a[type] < b[type])
                        return -1;
                    if (a[type] > b[type])
                        return 1;
                    return 0;
                } else if (order == "descending") {
                    if (b[type] < a[type])
                        return -1;
                    if (b[type] > a[type])
                        return 1;
                    return 0;
                }
            });
        } else if (type == "priority") {
            ticketList.sort(function (a, b) {
                if (order == "ascending") {
                    return a[type] - b[type];
                } else if (order == "descending") {
                    return b[type] - a[type];
                }
            });
        } else if (type == "date") {
            // handle sorting date
        } else {
            console.log("error: invalid sort type");
        }

        socket.emit('displayTickets', ticketList);
    });
}
*/

/*
     purpose: called when the admin edits or makes a new user with a particular role
     and password.

     author: Matthew Chan

     date: 04/29/2014
 */
function handleSetUser(socket) {
    socket.on('setUser', function(firstname, lastname, username, email, pass, role, dept) {
        // if username already exists, then this merely edits a user's info

        // DATABASE FUNCTION: set user info with parameters above
    });
}

/*
     purpose: called when a specific user is requested from the database for viewing by
     the client (for admins only).

     author: Matthew Chan

     date: 04/29/2014
 */
function handleGetUser(socket) {
    socket.on('getUser', function(id) {
        // ERROR HANDLING: check if user id exists in database
        /* if (checkUserExists(id) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: retrieve data for the user marked 'id'

        socket.emit('displayUser', firstname, lastname, username, email, pass, role, dept);
                                              // should probably add more fields for user
                                              // e.g. first name, last name, email, etc.
    });
}

/*
     purpose: called when the admin requests a list of users of a particular role to
     be displayed.

     author: Matthew Chan

     date: 04/29/2014
 */
function handleGetUsers(socket) {
    socket.on('getUsers', function(role) {
        // DATABASE FUNCTION: get list of users based on role
        // var userList = getUsers(role);
        // if role is null, get all users
        // also sends back user ids to use in requesting individual user data

        // placeholder data
        var userList = [
            {id: 5, firstname: "Mike", lastname: "Smith", username: "Msmith", email: "msmith@msmith.com", role: "Admin", dept: ["Finance", "Management"]},
            {id: 6, firstname: "Rob", lastname: "Boss", username: "Rboss", email: "rboss@rboss.com", role: "IT User", dept: ["Accounting", "Waste"]}
        ]

        socket.emit('displayUsers', userList);
    });
}

function handleSetDept(socket) {
    socket.on('setDept', function(name, id) {
        // ERROR HANDLING: check if user exists, and if he/she has manager level permission
        /* if (checkSupervisorExists(id) == false) {
               break from this function, and do nothing
           }
        */

        // ERROR HANDLING: check if supervisor already has the department assigned to them

        // if department name already exists, then this merely edits a dept's info

        // DATABASE FUNCTION: set dept info with parameters above
    });
}

function handleGetDepts(socket) {
    socket.on('getDepts', function() {
        // DATABASE FUNCTION: return an array of all department names and supervisors
        // var deptList = getDepts();

        // placeholder data
        var deptList = [
            {id: 1, name: "Finances", manager: "Bob"},
            {id: 2, name: "Info Tech", manager: "Miranda"},
            {id: 3, name: "Waste Management", manager: "Jason"},
            {id: 4, name: "Marketing", manager: "Robert"}
        ]

        socket.emit('displayDepts', deptList);
    });
}

/*
    purpose: called when a user posts a reply to a ticket

    author: Matthew Chan

    date: 04/29/2014
 */
function handleSetReply(socket) {
    socket.on('setReply', function(replyid, ticketid, user, desc) {
        // possible want: to make it so that users can edit their own replies
        // not a necessity right now
        // if "replyid" is null, make a new reply, otherwise ...

        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(ticketid) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: store parameters into new reply

        socket.emit('newReply', ticketid, desc, user);
    });
}

/*
    purpose: called when the ticket page loads and all replies for that ticket are
    pulled from the database, then sent to client to be displayed

    author: Matthew Chan

    date: 04/29/2014
 */
function handleGetReplies(socket) {
    socket.on('getReplies', function(ticketid) {
        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(ticketid) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: get an array of all replies for this particular ticket
        // marked "ticketid", in descending order by datetime
        // var replyList = getReplies(ticketid)

        socket.emit('displayReplies', replyList);
    });
}


