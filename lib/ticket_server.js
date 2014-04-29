var socketio = require('socket.io');
var io;

exports.listen = function(server) {
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
        handleSetTicket(socket);
        handleGetTicket(socket);
        handleGetTickets(socket);
    });
};

/*
    purpose: this is called when either a client submits a new ticket, or an admin/manager
    edits a ticket. if 'id' is not null, then this is a new ticket.

    author: Matthew Chan

    date: 04/28/2014
 */
function handleSetTicket(socket) {
    socket.on('setTicket', function(id_md5, user, dept, priority, email, title, desc) {
        if (id_md5 == null) {
            // this is a new ticket

            // call database function to store parameters into new ticket

            var newid = ''; // a new md5 id has to be randomly generated here
            socket.emit('newTicket', newid); // lets the client know that a new ticket has been created
        } else {
            // this is an existing ticket

            // ERROR HANDLING: check if ticket exists in database
            /* if (checkTicketExists(id_md5) == false) {
                   break from this function, and do nothing
               }
            */

            // call database function to store parameters into existing ticket
        }
    });
}

/*
    purpose: this is called when a specific ticket is requested from the database for
    viewing by the client (for admin, manager or IT user).

    author: Matthew Chan

    date: 04/28/2014
 */
function handleGetTicket(socket) {
    socket.on('getTicket', function(id_md5) {
        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(id_md5) == false) {
               break from this function, and do nothing
           }
        */

        // call database function to retrieve data for the ticket marked 'id_md5'

        socket.emit('displayTicket', user, dept, priority, email, title, desc);
    });
}

/*
    purpose: this is called when the client requests a list of tickets, filtered based
    on a selected set of options and search keywords if there is any existent. if the
    first two parameters are null, then this function only performs a simple search.

 author: Matthew Chan

 date: 04/28/2014
 */
function handleGetTickets(socket) {
    socket.on('getTickets', function(type, filters, keywords) {
        var ticketList;

        if (type == null || filters == null) {
            // if there are no type or filter specifications, then this performs a simple search
            ticketList = getAllTickets();

            // if there are no keywords, then this simply gets all tickets
            if (keywords != null) {
                FilterTicketsBySearch(ticketList, keywords);
            }
        }

        switch(type) {
            case 'complete':
                ticketList = GetAllTickets(filters);
                if (keywords != null) {
                    FilterTicketsBySearch(ticketList, keywords);
                }
                break;
            case 'expired':
                ticketList = GetExpiredTickets(filters);
                if (keywords != null) {
                    FilterTicketsBySearch(ticketList, keywords);
                }
                break;
            case 'date':
                ticketList = GetTicketsByDate(filters);
                if (keywords != null) {
                    FilterTicketsBySearch(ticketList, keywords);
                }
                break;
            case 'dept':
                ticketList = GetTicketsByDept(filters);
                if (keywords != null) {
                    FilterTicketsBySearch(ticketList, keywords);
                }
                break;
            case 'user':
                ticketList = GetTicketsByUser(filters);
                if (keywords != null) {
                    FilterTicketsBySearch(ticketList, keywords);
                }
                break;
            default:
                console.log('error: invalid search type');
        }

        socket.emit('displayTickets', ticketList);
    });
}

/*
 purpose: when client asks for all tickets, filter appropriately using 'filters'

 author: Matthew Chan

 date: 04/28/2014
 */
function GetAllTickets(filters) {
    if (GetAllTickets.length < 1) {
        // if there are no arguments, return an array of all tickets
        // DATABASE FUNCTION: get all tickets
        // return ______
    } else {
        var includeExpired = filters[includeExpired]; // boolean
        var orderBy = filters[orderBy]; // enumerated

        // DATABASE FUNCTION: pass in includeExpired and orderBy to get final list
        // return ______
    }
}



