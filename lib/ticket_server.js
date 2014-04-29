var socketio = require('socket.io');
var io;

exports.listen = function(server) {
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
        handleSetTicket(socket);
        handleGetTicket(socket);
        handleGetTickets(socket);

        handleSetUser(socket);
        handleGetUser(socket);
        handleGetUsers(socket);

        handleSetReply(socket);
        handleGetReplies(socket);
    });
};

/*
    purpose: called when either a client submits a new ticket, or an admin/manager
    edits a ticket. if 'id' is null, then this is a new ticket.

    author: Matthew Chan

    date: 04/28/2014
 */
function handleSetTicket(socket) {
    socket.on('setTicket', function(ticketid, user, dept, priority, email, title, desc) {
        if (ticketid == null) {
            // this is a new ticket

            // DATABASE FUNCTION: store parameters into new ticket
            // the datetime is automatically generated

            var newid = ''; // a new md5 id has to be randomly generated here, or returned from the database
            socket.emit('newTicket', newid); // lets the client know that a new ticket has been created
        } else {
            // this is an existing ticket

            // ERROR HANDLING: check if ticket exists in database
            /* if (checkTicketExists(ticketid) == false) {
                   break from this function, and do nothing
               }
            */

            // DATABASE FUNCTION: store parameters into existing ticket
            // the datetime is unchanged
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
    socket.on('getTicket', function(ticketid) {
        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(ticketid) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: retrieve data for the ticket marked 'ticketid'

        socket.emit('displayTicket', user, dept, date, priority, email, title, desc);
    });
}

/*
    purpose: when the client requests a list of tickets to display, this function
    factors in the selected filtering options and search parameters to retrieve
    and return the desired rows from the database.

    else, if an existing list is being sorted (when a client clicks on an arrow-button
    instead), all parameters in getTicket() except for sortOrder are null.

    author: Matthew Chan

    date: 04/29/2014
 */
function handleGetTickets(socket) {
    socket.on('getTickets', function(filters, searchParams, includeExpired) {
        if (filters.length < 1 || includeExpired == null) {
            console.log('error: invalid filter parameters');
        } else {
            // DATABASE FUNCTION: get list of tickets based on filter options/search params
            // var ticketList = getTickets(filters, searchParams, includeExpired);

            socket.emit('displayTickets', ticketList);
        }
    });
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
    socket.on('setUser', function(userid, pass, role) {
        // DATABASE FUNCTION: set user named 'userid' with the password 'pass and role 'role'
    });
}

/*
     purpose: called when a specific user is requested from the database for viewing by
     the client (for admins only).

     author: Matthew Chan

     date: 04/29/2014
 */
function handleGetUser(socket) {
    socket.on('getUser', function(userid) {
        // ERROR HANDLING: check if user id exists in database
        /* if (checkUserExists(userid) == false) {
               break from this function, and do nothing
           }
        */

        // DATABASE FUNCTION: retrieve data for the user marked 'userid'

        socket.emit('displayUser', userid, role); // should probably add more fields for user
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

        socket.emit('displayUsers', userList);
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


