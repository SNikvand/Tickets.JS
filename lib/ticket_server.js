var socketio = require( 'socket.io' );
var pg = require( 'pg' );
var config = require( './config' );
var dbhelper = require( './database' );
var md5 = require( 'MD5' );
var io;
var dbConfig = config.db;
var async = require( 'async' );
var Hashids = require( 'hashids' );
var hashids = new Hashids( config.secret );

/**
 *
 * @param server
 * @author
 * @date
 */
exports.listen = function ( server ) {
  io = socketio.listen( server );
  io.sockets.on( 'connection', function ( socket ) {
    handleSetTicket( socket );
    handleDeleteTicket( socket );
    handleGetTicket( socket );
    handleGetTickets( socket );

    handleSetUser( socket );
    handleDeleteUser( socket );
    handleGetUser( socket );
    handleGetUsers( socket );

    handleSetDept( socket );
    handleDeleteDept( socket );
    handleGetDepts( socket );

    handleSetReply( socket );
    handleGetReplies( socket );
  } );
};


/**
 *
 * @param user
 * @param pass
 * @param callback
 * @author
 * @date
 */
exports.authenticateLogin = function ( user, pass, callback ) {
  // userDepts is 'none' because 'null' means access to all departments
  var sendback = {isValid : false, issue : null, userRole : null, userDepts : 'none'};
  var userid;

  function checkUserExists( err, result ) {
    if ( result == null ) {
      sendback.isValid = false;
      sendback.issue = "Error: Invalid username/password.";
      callback( sendback );
      return console.error( sendback.issue );
    } else {
      userid = result;
      startAuth();
    }
  }

  // takes callback in order for things to run sequentially
  // i.e. user must exist in order for authentication to occur
  getUserId( user, checkUserExists );

  function startAuth() {
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      var query = "SELECT type FROM users WHERE name = '" + user +
        "' AND password = '" + pass + "';"; // !!! to do: needs to be md5-converted

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }

        if ( result.rows.length == 0 ) {
          sendback.isValid = false;
          sendback.issue = "Error: Invalid username/password.";
          callback( sendback );
          return console.error( sendback.issue );
        }

        sendback.userRole = result.rows[0].type;

        if ( sendback.userRole != "Admin" && sendback.userRole != "Manager" && sendback.userRole != "IT User" ) {
          sendback.isValid = false;
          sendback.issue = "Error: Invalid permissions/role doesn't exist.";
          callback( sendback );
          return console.error( sendback.issue );
        }

        sendback.isValid = true;

        getSessionDepts();
      } );
    } );
  }

  function getSessionDepts() {
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      var query;
      // if admin, get access to all departments
      if ( sendback.userRole == "Admin" ) {
        query = "SELECT name FROM departments;";
      } else {
        query = "SELECT d.name FROM user_dept v" +
          " JOIN departments d ON (v.dept_id = d.id)" +
          " WHERE v.user_id = " + userid + ";";
      }

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }

          if ( result.rows.length == 0 ) {
              sendback.issue = "No departments assigned to this user";
              getLogoutTime();
              return console.error( sendback.issue );
          }

          sendback.userDepts = [];
          for ( var x in result.rows ) {
            sendback.userDepts.push( result.rows[x].name );
          }

                getLogoutTime();
            });
        });
    };

    function getLogoutTime() {
        pg.connect(dbConfig, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            var query = "SELECT TO_CHAR(last_logout, 'YYYY-MM-DD HH24:MI:SS') AS last_logout FROM users WHERE id = '" + userid + "';";

            client.query(query, function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                }
                console.log("logout time: " + JSON.stringify(result.rows));

                sendback.lastLogout = result.rows[0].last_logout;
                callback(sendback);
            });
        });
    }
};

exports.setLogoutTime = function(user) {
    pg.connect(dbConfig, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var query = "UPDATE users SET last_logout = CURRENT_TIMESTAMP WHERE name = '" + user + "';";

        client.query(query, function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
        });
    });
}

/**
 purpose: called when either a client submits a new ticket, or an admin/manager
 edits a ticket. if 'id' is null, then this is a new ticket.

/**
 * called when either a client submits a new ticket, or an admin/manager
 * edits a ticket. if 'id' is null, then this is a new ticket.
 * @param socket
 * @author Matthew Chan
 * @date 04/29/2014
 * @editedBy John Welker
 * @date 05/05/2014
 */
function handleSetTicket( socket ) {
  socket.on( 'setTicket', function ( id, title, dept, description, priority, submittedBy, clientEmail,
                                     assignedTo, alteredBy, dateCreated, dateDue, dateAltered, isCompleted, isArchive ) {
    // conversions from string to id
    var queries = 0;
    var results = 0;
    var ticket = {
      id          : id,
      title       : title,
      dept        : dept,
      description : description,
      priority    : priority,
      submittedBy : submittedBy,
      clientEmail : clientEmail,
      assignedTo  : assignedTo,
      alteredBy   : alteredBy,
      dateCreated : dateCreated,
      dateDue     : dateDue,
      dateAltered : dateAltered,
      isCompleted : isCompleted,
      isArchive   : isArchive
    };

    if ( dept != null ) {
      queries++;
    }
    if ( assignedTo != null ) {
      queries++;
    }
    if ( alteredBy != null ) {
      queries++;
    }

    if ( dept != null ) {
      dbhelper.queryDatabase( dbhelper.getDeptIdQuery( dept ), function ( err, result ) {
        if ( result.rows.length == 0 ) {
          socket.emit( 'error', 'That department does not exist' );
          return console.error( 'Department does not exist' );
        }
        ticket.dept = result.rows[0].id;
        results++;
        if ( results == queries ) {
          setTicket( socket, ticket );
        }
      } );
    }

    if ( alteredBy != null ) {
      dbhelper.queryDatabase( dbhelper.getUserIdQuery( alteredBy ), function ( err, result ) {
        if ( result.rows.length == 0 ) {
          socket.emit( 'error', 'That user does not exist' );
          return console.error( 'User does not exist ' );
        }
        ticket.alteredBy = result.rows[0].id;
        results++;
        if ( results == queries ) {
          setTicket( socket, ticket );
        }
      } );
    }

    if ( assignedTo != null ) {
      dbhelper.queryDatabase( dbhelper.getUserIdQuery( assignedTo ), function ( err, result ) {
        console.log("result: " + JSON.stringify(result.rows));
        if ( result.rows.length == 0 ) {
          socket.emit( 'error', 'That user does not exist' );
          return console.error( 'that user does not exist' );
        }
        if ( result.rows[0].type != "IT User" ) {
          socket.emit( 'error', 'Tickets can only be assigned to IT users' );
          return console.error( 'error', 'Tickets can only be assigned to IT users' );
        }
        ticket.assignedTo = result.rows[0].id;
        results++;
        if ( results == queries ) {
          setTicket( socket, ticket );
        }
      } );
    }

  } );
}


/**
 * called when a specific ticket is requested from the database for
 * viewing by the client (for admin, manager or IT user).
 * @param socket
 * @author Matthew Chan
 * @date 04/28/2014
 */
function handleDeleteTicket( socket ) {
  socket.on( 'deleteTicket', function ( id, isArchive ) {
    var c_table = (isArchive ? "comments_archive" : "comments");
    var table = (isArchive ? "tickets_archive" : "tickets");
    id = hashids.decrypt( id );
    //var getHash = "SELECT hash FROM " + table + " WHERE hash = '" + id + "';"; // select the id based on hash
    var deleteComments = "DELETE FROM " + c_table + " WHERE ticket_id = '" + id + "';" // delete from comment table
    var deleteTicket = "DELETE FROM " + table + " WHERE id = '" + id + "';"; // delete from table

    // delete from comments
    dbhelper.queryDatabase( deleteComments, function ( err, result ) {
      if ( err ) {
        return console.error( 'Error querying database', err );
      }


      // delete ticket
      dbhelper.queryDatabase( deleteTicket, function ( err, result ) {
        if ( err ) {
          return console.error( 'Error querying database', err );
        }

      } );
    } );
  } );
}


/**
 * called when a specific ticket is requested from the database for
 * viewing by the client (for admin, manager or IT user).
 * @param socket
 * @author Matthew Chan
 * @date 04/28/2014
 */
function handleGetTicket( socket ) {
  socket.on( 'getTicket', function ( id, isArchive ) {

    id = hashids.decrypt( id );
    var table = (isArchive == true ? "tickets_archive" : "tickets");

    var query = "SELECT t.id, t.title, t.author, t.author_email," +

        " TO_CHAR(t.create_date, 'YYYY-MM-DD HH24:MI:SS') AS create_date," + // timestamp formatting

        " d.name AS department, t.description," +
        " t.priority," +

        " TO_CHAR(t.due_date, 'YYYY-MM-DD HH24:MI:SS') AS due_date," + // timestamp formatting

        " a.name AS assigned_to," +

        " TO_CHAR(t.altered_date, 'YYYY-MM-DD HH24:MI:SS') AS altered_date," + // timestamp formatting

        " b.name AS altered_by," +

        " TO_CHAR(complete_date, 'YYYY-MM-DD HH24:MI:SS') AS complete_date" + // timestamp formatting

        " from " + table + " t JOIN" +
        " departments d ON (t.department = d.id) LEFT JOIN users a ON (t.assigned_to = a.id) LEFT JOIN users b ON" +
        " (t.altered_by = b.id) WHERE t.id = " + id + ";";

    dbhelper.queryDatabase( query, function ( err, result ) {
      if ( err ) {
        return console.error( 'error running query', err, query );
      }

      // if there are no matching rows, error handle
      if ( result.rows.length == 0 ) {
        return console.error( 'No rows with that id' );
      }

      socket.emit( 'displayTicket', hashids.encrypt( result.rows[0].id ), result.rows[0].title, result.rows[0].department, result.rows[0].description,
        result.rows[0].priority, result.rows[0].author, result.rows[0].author_email, result.rows[0].assigned_to,
        result.rows[0].altered_by, result.rows[0].create_date, result.rows[0].due_date, result.rows[0].altered_date,
        result.rows[0].complete_date
      );
    } );
  } );
}


/**
 * when the client requests a list of tickets to display, this function
 * factors in the selected filtering options and search parameters to retrieve
 * and return the desired rows from the database.
 * @param socket
 * @author Matthew Chan
 * @date 04/29/2014
 */
function handleGetTickets( socket ) {
  socket.on( 'getTicketsAdmin1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin1", orderBy, direction )
  } );
  socket.on( 'getTicketsAdmin2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin2", orderBy, direction )
  } );
  socket.on( 'getTicketsAdmin3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin3", orderBy, direction )
  } );

  socket.on( 'getTicketsManager1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager1", orderBy, direction )
  } );
  socket.on( 'getTicketsManager2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager2", orderBy, direction )
  } );
  socket.on( 'getTicketsManager3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager3", orderBy, direction )
  } );

  socket.on( 'getTicketsITUser1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser1", orderBy, direction )
  } );
  socket.on( 'getTicketsITUser2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser2", orderBy, direction )
  } );
  socket.on( 'getTicketsITUser3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
    fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser3", orderBy, direction )
  } );

    socket.on( 'getTicketsLogout', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
        fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "logout", orderBy, direction )
    } );

    socket.on( 'getTicketsView', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, orderBy, direction ) {
        fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "view", orderBy, direction )
    } );
}


/**
 *
 * @param filters
 * @param searchParams
 * @param includeCompleted
 * @param includeExpired
 * @param includeArchived
 * @param amount
 * @param socket
 * @param type
 * @param orderBy
 * @param direction
 * @author
 * @date
 */
function fetchTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, type, orderBy, direction ) {
  var ticketList = [];
  var neededCalls = ( includeArchived == "includeArchived" ? 2 : 1 );
  var madeCalls = 0;

  async.series( [
      function ( callback ) {
        if ( filters.alteredBy != null ) {
          getUserId( filters.alteredBy, callback );
        } else {
          callback( null, null );
        }
      },
      function ( callback ) {
        if ( filters.assignedTo != null ) {
          getUserId( filters.assignedTo, callback );
        } else {
          callback( null, null );
        }
      },
      function ( callback ) {
        if ( filters.dept != null ) {
          // split different department names into different indexes of array
          var deptArray = filters.dept.split( " " );

          getMultipleDeptIds( deptArray, callback )
        } else {
          callback( null, null );
        }
      }
    ],
    function ( err, results ) {
      filters.alteredBy = results[0];
      filters.assignedTo = results[1];
      filters.dept = results[2];
      startFetch();
    } );

  function startFetch() {
    if ( filters.length < 1 ) {
      console.log( 'error: invalid filter parameters' );
    } else {
      if ( includeExpired == "onlyExpired" ) {
        includeArchived = "excludeArchived";
      } else if ( includeArchived == "onlyArchived" ) {
        includeExpired = "excludeExpired";
      }

      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }

                if ( includeArchived != "onlyArchived" ) {
                    var query1 = dbhelper.searchForTicketsQuery( "tickets", filters, searchParams, includeCompleted, includeExpired, amount, orderBy, direction, type );
                    query1 += ";";
                    client.query( query1, function ( err, result ) {
                        done();
                        if ( err ) {
                            return console.error( 'error running query', err );
                        }


            for ( var i = 0; i < result.rows.length; i++ ) {
              result.rows[i].id = hashids.encrypt(result.rows[i].id);
              result.rows[i].isArchive = false;
            }

            ticketList.push.apply( ticketList, result.rows );

            madeCalls++;
            if ( madeCalls == neededCalls ) {
              returnTicketList( socket, type, ticketList );
            }
          } );
        }
        if ( includeArchived != "excludeArchived" ) {
          var query2 = dbhelper.searchForTicketsQuery( "tickets_archive", filters, searchParams, includeCompleted, includeExpired, amount, orderBy, direction, type );
          query2 += ";";
          client.query( query2, function ( err, result ) {
            done();
            if ( err ) {
              return console.error( 'error running query', err );
            }


            for ( var i = 0; i < result.rows.length; i++ ) {
              result.rows[i].id = hashids.encrypt(result.rows[i].id);
              result.rows[i].isArchive = true;
            }
            ticketList.push.apply( ticketList, result.rows );

            madeCalls++;
            if ( madeCalls == neededCalls ) {
              returnTicketList( socket, type, ticketList );
            }
          } );
        }
      } );
    }
  }
}


/**
 *
 * @param socket
 * @param type
 * @param ticketList
 */
function returnTicketList( socket, type, ticketList ) {
  switch ( type ) {
    case "admin1":
      socket.emit( 'displayTicketsAdmin1', ticketList );
      break;
    case "admin2":
      socket.emit( 'displayTicketsAdmin2', ticketList );
      break;
    case "admin3":
      socket.emit( 'displayTicketsAdmin3', ticketList );
      break;
    case "manager1":
      socket.emit( 'displayTicketsManager1', ticketList );
      break;
    case "manager2":
      socket.emit( 'displayTicketsManager2', ticketList );
      break;
    case "manager3":
      socket.emit( 'displayTicketsManager3', ticketList );
      break;
    case "ituser1":
      socket.emit( 'displayTicketsITUser1', ticketList );
      break;
    case "ituser2":
      socket.emit( 'displayTicketsITUser2', ticketList );
      break;
    case "ituser3":
      socket.emit( 'displayTicketsITUser3', ticketList );
      break;
    case "view":
      socket.emit( 'displayTicketsView', ticketList );
      break;
    case "logout":
      socket.emit( 'displayTicketsLogout', ticketList );
      break;
    default:
      console.log( "error: no 'get tickets' message type specified" );
  }
}


/**
 * Saves changes to, or create a new user.
 * @param socket server socket to listen for messages
 * @author Matthew Chan
 * @date 04/29/2014
 * @editedBy John Welker
 * @editDate 09/05/2014
 */
function handleSetUser( socket ) {
  socket.on( 'setUser', function ( id, name, email, pass, role ) {
    // connect to the database
    pg.connect( dbConfig, function ( err, client, done ) {
      // error connecting to the database
      if ( err ) {
        socket.emit( 'error', "Error connecting to the database" );
        return console.error( 'error connecting to the database', err );
      }

      if ( id == null ) {
        // new user

        // check if user already exists
        var checkQuery = "SELECT * FROM users WHERE name = '" + name + "';";
        client.query( checkQuery, function ( err, result ) {
          // return client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', "Error running query.", err );
            return console.error( 'Error running query', err );
          }
          // If any results are returned then that user is already in the database.
          if ( result.rows.length > 0 ) {
            socket.emit( 'error', "A user already exists with that name." );
            return console.error( 'User already exists' );
          }

          // construct query to create new user.
          var jUser = { name : name, email : email, pass : md5( pass ), role : role};
          var query = dbhelper.newUserQuery( jUser );

          // add the new user to the database
          client.query( query, function ( err, result ) {
            // return the client to the pool
            done();
            if ( err ) {
              socket.emit( 'error', 'Error querying database', err );
              return console.error( 'Error querying database', err );
            }
            socket.emit( 'success', 'user successfully saved.' );
          } );
        } );
      } else {
        // modify user

        var testQuery = "SELECT id FROM users WHERE id = '" + id + "';";
        client.query( testQuery, function ( err, result ) {
          // return the client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', 'error querying database', err );
            return console.error( 'error querying database', err );
          }

          // if the user does not exist, send error message
          if ( result.rows.length == 0 ) {
            socket.emit( 'error', 'No users with that id' );
            return console.error( 'No rows with that hash' );
          }

          if ( pass != undefined ) {
            pass = md5( pass );
          }

          // Construct the modify user query
          var jUser = { id : id, name : name, email : email, pass : pass, role : role };
          var query = dbhelper.modifyUserQuery( jUser );

          client.query( query, function ( err, result ) {
            // return the client to the pool
            done();
            if ( err ) {
              socket.emit( 'error', 'Error querying database', err );
              return console.error( 'Error querying database', err );
            }
            socket.emit( 'success', 'User successfully changed.' );
          } );
        } );
      }
    } );
  } );
}


/**
 *
 * @param socket
 */
function handleDeleteUser( socket ) {
  socket.on( 'deleteUser', function ( id ) {
    // delete tickets
    // delete tickets_archive
    // delete user_dept
    // then finally delete from departments

    console.log( "id: " + id );

    //var deleteTickets = "DELETE FROM tickets WHERE department = " + id + ";";
    //var deleteTicketsArchive = "DELETE FROM tickets_archive WHERE department = " + id + ";";

    var deleteTickets1 = "UPDATE tickets SET altered_by = NULL WHERE altered_by = " + id + ";";
    var deleteTickets2 = "UPDATE tickets SET assigned_to = NULL WHERE assigned_to = " + id + ";";
    var deleteTicketsArchive1 = "UPDATE tickets_archive SET altered_by = NULL WHERE altered_by = " + id + ";";
    var deleteTicketsArchive2 = "UPDATE tickets_archive SET assigned_to = NULL WHERE assigned_to = " + id + ";";
    var deleteComments = "UPDATE comments SET user_id = NULL WHERE user_id = " + id + ";";
    var deleteCommentsArchive = "UPDATE comments_archive SET user_id = NULL WHERE user_id = " + id + ";";
    var deleteUserDept = "DELETE FROM user_dept WHERE user_id = " + id + ";";

    async.series( [
        function ( callback ) {
          deleteQuery( deleteTickets1, callback );
        },
        function ( callback ) {
          deleteQuery( deleteTickets2, callback );
        },
        function ( callback ) {
          deleteQuery( deleteTicketsArchive1, callback );
        },
        function ( callback ) {
          deleteQuery( deleteTicketsArchive2, callback );
        },
        function ( callback ) {
          deleteQuery( deleteComments, callback );
        },
        function ( callback ) {
          deleteQuery( deleteCommentsArchive, callback );
        },
        function ( callback ) {
          deleteQuery( deleteUserDept, callback );
        }
      ],
      function ( err, result ) {
        var query = "DELETE FROM users WHERE id = " + id + ";";
        pg.connect( dbConfig, function ( err, client, done ) {
          if ( err ) {
            return console.error( 'error fetching client from pool', err );
          }
          client.query( query, function ( err, result ) {
            done();
            if ( err ) {
              return console.error( 'error running query', err );
            }
          } );
        } );
      }
    );

    function deleteQuery( query, callback ) {
      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }
        client.query( query, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          callback( null, result );
        } );
      } );
    }
  } );
}


/**
 * called when a specific user is requested from the database for viewing by
 * the client (for admins only).
 * @param socket server socket to listen for messages
 * @author Matthew Chan
 * @date 04/29/2014
 * @editedBy John Welker
 * @editDate 09/05/2014
 */
function handleGetUser( socket ) {
  socket.on( 'getUser', function ( id ) {
    // connect to the database
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'error connecting to the database', err );
        return console.error( 'error connecting to the database', err );
      }

      // Get the requested user.
      var query = "SELECT * FROM users WHERE id = " + id + ";";
      client.query( query, function ( err, result ) {
        // return the client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }

        // if there are no matching rows, error handle
        if ( result.rows.length == 0 ) {
          socket.emit( 'error', 'No users exist with that id' );
          return console.error( 'No users exist with that id' );
        }

        socket.emit( 'displayUser', result.rows[0].name, result.rows[0].email, result.rows[0].password, result.rows[0].type );
      } );
    } );
  } );
}


/**
 * called when the admin requests a list of users of a particular role to
 * be displayed.
 * @param socket server socket to listen for messages
 * @author Matthew Chan
 * @date 04/29/2014
 * @editedBy John Welker
 * @editdate 09/05/2014
 */
function handleGetUsers( socket ) {
  socket.on( 'getUsers', function ( role ) {
    // DATABASE FUNCTION: get list of users based on role
    // var userList = getUsers(role);
    // if role is null, get all users
    // also sends back user ids to use in requesting individual user data

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'error fetching client from pool', err );
        return console.error( 'error fetching client from pool', err );
      }

      var query = "SELECT * FROM users";

      // If a role is given, restrict the query to users of that role
      if ( role != null ) {
        query += " WHERE role = '" + role + "';";
      } else {
        query += ";";
      }

      client.query( query, function ( err, result ) {
        // return the client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }
        socket.emit( 'displayUsers', result.rows );
      } );
    } );
  } );
}


/**
 * Handles set department requests by querying the database to create, or modify, and then add users to departments.
 * @param socket server socket to listen for messages
 * @author John Welker
 * @date 09/05/2014
 */
function handleSetDept( socket ) {
  socket.on( 'setDept', function ( deptid, deptname, addUsers, delUsers ) {
    if ( deptid == null ) {
      // new department

      var query1 = "SELECT * FROM departments WHERE name = '" + deptname + "';";
      dbhelper.queryDatabase( query1, function ( err, result ) {
        if ( result.rows.length > 0 ) {
          socket.emit( 'error', 'A department already exists by that name' );
          return console.error( "A department already exists by that name" );
        }

        // query the database to create a new department
        var query2 = "INSERT INTO departments (name) VALUES ( '" + deptname + "' ) RETURNING id;";
        dbhelper.queryDatabase( query2, function ( err, result ) {
          if ( err ) {
            socket.emit( 'error', 'error running query', err );
            return console.error( 'error running query', err );
          }
          socket.emit( 'successful', 'Successfully added department' );

          if ( addUsers != null || delUsers != null ) {
            assignUsers( addUsers, delUsers, result.rows[0].id );
          }
        } );
      } );
    } else {
      // modifying existing department

      // query the database to check that the department exists.
      var query1 = "SELECT * FROM departments WHERE id = '" + deptid + "';";
      dbhelper.queryDatabase( query1, function ( err, result ) {
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }
        if ( result.rows.length == 0 ) {
          socket.emit( 'error', 'Department by that id does not exist' );
          return console.error( "Department by that id does not exist" );
        }

        // query the database to change the department name
        var query2 = "UPDATE departments SET name = '" + deptname + "' WHERE id = '" + deptid + "';";
        dbhelper.queryDatabase( query2, function ( err, result ) {
          if ( err ) {
            socket.emit( 'error', 'error running query', err );
            return console.error( 'error running query', err );
          }
          socket.emit( 'successful', 'Successfully changed department.' );

            if ( addUsers != null || delUsers != null ) {
                assignUsers( addUsers, delUsers, deptid );
            }
        } );
      } );
    }
  } );
}

/**
 * Called by setDepartment to add users to a given department
 * @param usernames a list of usernames seperated by spaces
 * @param deptID the department to add the users to
 * @author John Welker
 * @date 14/05/2014
 */
function assignUsers( addUsers, delUsers, deptID ) {
  if (addUsers != null) {
      addUsers = addUsers.split(" ");

      addUsers.forEach(function (user) {
          // get the id from the username
          var query = "SELECT id FROM users WHERE name='" + user + "';";
          dbhelper.queryDatabase(query, function (err, result) {
              console.log("assigning user: " + query);
              if (err) {
                  socket.emit('error', 'error querying database', err);
                  return console.error('error querying database', err);
              }

              // insert the user id with the dept id into the database
              var query2 = "INSERT INTO user_dept VALUES( " + result.rows[0].id + ", " + deptID + " );";
              dbhelper.queryDatabase(query2, function (err, result) {
                  if (err) {
                      socket.emit('error', 'error querying database', err);
                      return console.error(' error querying database', err);
                  }

              });
          });
      });
  }

  if (delUsers != null) {
      delUsers = delUsers.split(" ");

      delUsers.forEach(function (user) {
          // get the id from the username
          var query = "SELECT id FROM users WHERE name='" + user + "';";
          dbhelper.queryDatabase(query, function (err, result) {
              console.log("deleting user: " + query);
              if (err) {
                  socket.emit('error', 'error querying database', err);
                  return console.error('error querying database', err);
              }

              // delete the user id and dept id row from the user_dept table
              var query2 = "DELETE FROM user_dept WHERE dept_id = " + deptID +
                  " AND user_id = " + result.rows[0].id + ";";
              dbhelper.queryDatabase(query2, function (err, result) {
                  if (err) {
                      socket.emit('error', 'error querying database', err);
                      return console.error(' error querying database', err);
                  }

              });
          });
      });
  }
}

/**
 * upon receiving a deleteDept message function will delete all references to that department in the database, then delete the department itself.
 *
 * @param socket server socket to listen on
 * @author John Welker
 * @date 14/05/2014
 */
function handleDeleteDept( socket ) {
  socket.on( 'deleteDept', function ( id ) {
    // delete tickets
    // delete tickets_archive
    // delete user_dept
    // then finally delete from departments

    console.log( "id: " + id );

    var queries = [
        "DELETE FROM tickets WHERE department = " + id + ";",
        "DELETE FROM tickets_archive WHERE department = " + id + ";",
        "DELETE FROM user_dept WHERE dept_id = " + id + ";"
    ]

    var queryies = 3;
    var finished = 0;

    queries.forEach( function ( query ) {
      dbhelper.queryDatabase( query, function ( err, result ) {
        if ( err ) {
          return console.error( 'error querying database', error );
        }
        finished++;
        if ( finished == queryies ) {
          // Delete the dept
          var query = "DELETE FROM departments WHERE id=" + id + ";";
          dbhelper.queryDatabase( query, function ( err, result ) {
            if ( err ) {
              return console.error( 'error querying database', err );
            }
          } );
        }
      } );
    } );
  } );
}


/**
 *
 * @param socket
 * @author
 * @date
 */
function handleGetDepts( socket ) {
  socket.on( 'getDepts', function () {
    async.series( {
        depts : function ( callback ) {
          getDepts( callback );
        },
        users : function ( callback ) {
          getUsers( callback );
        }
      },
      function ( err, result ) {
        getUserDept( result.depts, result.users );
      } );

    function getDepts( callback ) {
      var query = "SELECT * FROM departments";
      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }
        client.query( query, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          callback( null, result.rows );
        } );
      } );
    }

    function getUsers( callback ) {
      var query = dbhelper.getUserDeptQuery();
      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }
        client.query( query, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          callback( null, result.rows );
        } );
      } );
    }

    function getUserDept( depts, users ) {
      console.log( JSON.stringify( depts ) );
      console.log( JSON.stringify( users ) );

      var result = {};
      for ( var x in depts ) {
        result[depts[x].name] = {};
        result[depts[x].name].id = depts[x].id;
        result[depts[x].name].name = depts[x].name;
        result[depts[x].name].managers = [];
        for ( var y in users ) {
          if ( users[y].name == depts[x].name ) {
            result[depts[x].name].managers.push( users[y].manager );
          }
        }
        if ( result[depts[x].name].managers.length == 0 ) {
          result[depts[x].name].managers.push( "" );
        }
      }

      socket.emit( 'displayDepts', result );
    }
  } );
}


/**
 * called when a user posts a reply to a ticket
 * @param socket
 * @author Matthew Chan
 * @date 04/29/2014
 */
function handleSetReply( socket ) {
  socket.on( 'setReply', function ( ticketId, isArchive, userName, desc ) {
    // possible want: to make it so that users can edit their own replies
    // not a necessity right now
    // if "replyid" is null, make a new reply, otherwise ...

    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketid) == false) {
     break from this function, and do nothing
     }
     */

    // DATABASE FUNCTION: store parameters into new reply

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'Error connecting to the database', err );
        return console.error( 'Error connecting to the database', err );
      }

      var getUserQuery = "SELECT id FROM users WHERE name = '" + userName + "';";
      client.query( getUserQuery, function ( err, result ) {
        // return client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'Error querying database', err );
          return console.error( 'Error querying database', err );
        }

        // if null, means a non-logged in user (the client) is posting this reply
        var userId = (result.rows.length == 0 ? null : result.rows[0].id);

        ticketId = hashids.decrypt( ticketId );

        var query = dbhelper.newReplyQuery( ticketId, isArchive, userId, desc );
        client.query( query, function ( err, result2 ) {
          // return client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', 'Error querying database', err );
            console.error( '4 Error querying database', err );
            return console.error( query );
          }
          socket.emit( 'newReply', result2 );
        } );
      } );
    } );
  } );
}


/**
 * called when the ticket page loads and all replies for that ticket are
 * pulled from the database, then sent to client to be displayed
 * @param socket
 * @author Matthew Chan
 * @date 04/29/2014
 */
function handleGetReplies( socket ) {
  socket.on( 'getReplies', function ( ticketId, isArchive ) {
    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketid) == false) {
     break from this function, and do nothing
     }
     */

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'Error connecting to the database', err );
        return console.error( 'Error connecting to the database', err );
      }

      ticketId = hashids.decrypt( ticketId );

      var table = (isArchive == true ? "comments_archive" : "comments");
      var query = "SELECT c.ticket_id, u.name," +
          " TO_CHAR(c.create_date, 'YYYY-MM-DD HH24:MI:SS') AS create_date," +
          " c.description FROM " +
        table + " c JOIN users u ON (c.user_id = u.id)" +
        " WHERE ticket_id = '" + ticketId + "'" +
        " ORDER BY create_date desc;";
      client.query( query, function ( err, result ) {
        // return client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'Error querying database', err );
          console.error( '5 Error querying database', err );
          return console.error( query );
        }

        socket.emit( 'displayReplies', result.rows );
      } );
    } );
  } );
}


/**
 * Determines whether to create a ticket or modify a current ticket.
 * @param socket client socket to send messages to
 * @param ticket a ticket json object
 * @author John Welker
 * @date 10/05/2014
 */
function setTicket( socket, ticket ) {
  console.log( "ticket: " + JSON.stringify( ticket ) );

  if ( ticket.id == null ) {
    // DATABASE FUNCTION: store parameters into new ticket
    // dateCreated and dateDue are automatically generated
    // assignedTo, alteredBy, dateAltered and dateCompleted are null
    dbhelper.queryDatabase( dbhelper.newTicketQuery( ticket ), function ( err, result ) {
      if ( err ) {
        return console.error( 'error running query', err );
      }
      // encrypt the id into the hash
      var hash = hashids.encrypt( result.rows[0].id );
      // log the ticket's hash
      console.log( hash );
      // send the hash out to the clients.
      socket.broadcast.emit( 'newTicket', hash );
    } );
  } else {
    // this is an existing ticket

    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketId) == false) {
     break from this function, and do nothing
     }
     */
    var table = "tickets";
    if ( ticket.isArchive == true ) {
      table = "tickets_archive";
    }
    ticket.id = hashids.decrypt( ticket.id );
    dbhelper.queryDatabase( dbhelper.modifyTicketQuery( ticket ), function ( err, result ) {
      console.log( result.rows[0] );
    } );


    var query = "SELECT * FROM " + table + " WHERE id='" + ticket.id + "';";

    dbhelper.queryDatabase( query, function ( err, result ) {

      if ( err ) {
        // handle errors
        console.error( 'Error querying database', err );
      }
      if ( result.rows.length == 0 ) {
        socket.emit( 'error', 'Ticket does not exist' );
        console.log( "check" );
        return console.error( 'Ticket does not exist' );
      }
      ticket.id = result.rows[0].id;

      // get a query string to modify the database based on the jTicket
      dbhelper.queryDatabase( dbhelper.modifyTicketQuery( ticket ), function ( err, result ) {
        console.log( result.rows[0] );
      } );
    } );
  }
}


/**
 * helper functions to get user id/dept id
 * @param username
 * @param callback
 * @author
 * @date
 */
function getUserId( username, callback ) {
  // get userid based on username from users table
  var userquery = "SELECT id FROM users WHERE name = '" + username + "';";
  dbhelper.queryDatabase( userquery, function ( err, result ) {
    if ( err ) {
      return console.error( 'error running query', err );
    }
    if ( result.rows.length == 0 ) {
      console.error( "No user exists by that name" );
      callback( null, null );
      return;
    }

    callback( null, result.rows[0].id );
  } );
}


/**
 * if an entire user's session array of departments is passed in, parse through each get the ids for each
 * !!! do this !!!
 * @param deptnames
 * @param callback
 * @author
 * @date
 */
function getMultipleDeptIds( deptnames, callback ) {
  var queryArray = [];
  var funcArray = [];
  var deptIds = [];

  // make the queries to be run, store them in their array
  for ( var x in deptnames ) {
    queryArray.push( "SELECT id FROM departments WHERE name = '" + deptnames[x] + "';" );
  }

  function queryCallback( err, deptid ) {
    deptIds.push( deptid );
    if ( deptIds.length == queryArray.length ) {
      callback( null, deptIds );
    }
  }

  queryArray.forEach( function ( query ) {
    getDeptIdWithQuery( query, queryCallback );
  } );
}


/**
 *
 * @param query
 * @param callback
 * @author
 * @date
 */
function getDeptIdWithQuery( query, callback ) {
  pg.connect( dbConfig, function ( err, client, done ) {
    client.query( query, function ( err, result ) {
      done();
      if ( err ) {
        return console.error( 'error running query', err );
      }
      if ( result.rows.length == 0 ) {
        console.error( "No department exists by that name" );
        callback( null, null );
        return;
      }

      callback( null, result.rows[0].id );
    } );
  } );
}


