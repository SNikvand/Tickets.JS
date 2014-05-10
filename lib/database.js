/**
 * Purpose: Helper functions to create database query
 *
 * Created by John
 * Date Modified: 5/05/2014
 * Version 0.1
 */


/**
 * Purpose: Get the highest ID number in the tickets table
 *
 * @return database query string to get the largest ticket number
 */
function getMaxIdQuery() {
  return "SELECT MAX(id) AS id FROM tickets;";
}
exports.getMaxIdQuery = getMaxIdQuery;

/**
 * Purpose makes an insert database query string from a user json object
 *
 * @param jTicket  json object representing a ticket { id, hash, title, author, email, department, description, level }
 * All fields required
 *
 * @return database query string
 */
function newTicketQuery( jTicket ) {
  var query = "INSERT INTO tickets VALUES ( " + jTicket.id + ", '" + jTicket.hash + "', '" + jTicket.title + "', '" + jTicket.author + "', '"
    + jTicket.email + "', CURRENT_DATE, " + jTicket.department + ", '" + jTicket.description + "', " + jTicket.level + " ) RETURNING *;";
  return query;
}
exports.newTicketQuery = newTicketQuery;
/**
 * Purpose makes a modify database query from a ticket json object
 *
 * @param jTicket  json object representing a ticket
 * { id, level, altered_by, assigned_to, due_date, complete[true/false] }
 * Id is required
 * others are optional
 *
 * @return database query string
 */
function modifyTicketQuery( jTicket, isArchive ) {
  var table = (isArchive == true ? "tickets_archive" : "tickets");

  var query = "UPDATE " + table + " SET ";
  var qParts = new Array();

  if ( jTicket.level != undefined ) {
    qParts.push( " level=" + jTicket.level );
  }

  if ( jTicket.altered_by != undefined ) {
    qParts.push( " altered_by='" + jTicket.altered_by + "'" );
  }

  if ( jTicket.assigned_to != undefined ) {
    qParts.push( " assigned_to='" + jTicket.assigned_to + "'" );
  }

  if ( jTicket.due_date != undefined ) {
    qParts.push( " due_date=DATE '" + jTicket.due_date + "'" );
  }

  if ( jTicket.complete == true ) {
    qParts.push( " complete_date=CURRENT_DATE" );
  }

  qParts.push( " altered_date=CURRENT_DATE" );

  for ( var i = 0; i < qParts.length; i++ ) {
    query += qParts[i];
    if ( i < qParts.length - 1 ) {
      query += ", "
    }
  }

  query += " WHERE id='" + jTicket.id + "' RETURNING * ;";
  return query;
}
exports.modifyTicketQuery = modifyTicketQuery;


/**
 * Purpose makes a insert database query from a user json object
 *
 * @param jUser json object representing a user
 *
 * @return database query string
 */
function newUserQuery( jUser ) {
  var query = "INSERT INTO users (name, email, password, type) VALUES ( '" + jUser.name + "', '" + jUser.email + "', '" + jUser.pass + "', '"
    + jUser.role + "' );";
  return query;
}
exports.newUserQuery = newUserQuery;


/**
 * Purpose modifies the entry in the users database
 *
 * @param jUser json object representing a user
 *
 * @return database query string
 */
function modifyUserQuery( jUser ) {
  var query = "UPDATE users SET ";
  var qParts = new Array();

  if ( jUser.name != undefined ) {
    qParts.push( " name=" + jUser.name );
  }

  if ( jUser.email != undefined ) {
    qParts.push( " email='" + jUser.email + "'" );
  }

  if ( jUser.pass != undefined ) {
    qParts.push( " password='" + jUser.pass + "'" );
  }

  if ( jUser.role != undefined ) {
    qParts.push( " type='" + jUser.role + "'" );
  }

  for ( var i = 0; i < qParts.length; i++ ) {
    query += qParts[i];
    if ( i < qParts.length - 1 ) {
      query += ", "
    }
  }

  query += " WHERE id='" + jUser.id + "' RETURNING * ;";
  return query;
}
exports.modifyUserQuery = modifyUserQuery;


/**
 * Purpose makes an insert query for a department in the database
 *
 * @param deptid name and user (manager) id if provided
 *
 * @return database query string
 */
function newUserDeptQuery( deptid, userid ) {

  var query = "INSERT INTO user_dept VALUES dept_id = " + deptid + ", user_id = " + userid + ";";

  return query;
}
exports.newUserDeptQuery = newUserDeptQuery;


/**
 * Purpose retrieves the query for getting all users along with their assigned departments
 *
 * @param department name and user (manager) id if provided
 *
 * @return database query string
 */
function getUserDeptQuery() {
  var query = "SELECT d.name AS name, u.name AS manager FROM user_dept a JOIN departments d ON (d.id = a.dept_id) JOIN users u ON (u.id = a.user_id);";

  return query;
}
exports.getUserDeptQuery = getUserDeptQuery;


/**
 * Purpose searches for and returns a query for a collection of tickets based on parameters
 *
 * @param search and filter parameters
 *
 * @return database query string
 */
function searchForTicketsQuery( table, filters, searchParams, includeCompleted, includeExpired, amount ) {
  var query = "SELECT t.hash, t.title, t.author, t.author_email, t.create_date, d.name as department, t.description," +
    " t.priority, t.due_date, a.name as assigned_to, t.altered_date, b.name as altered_by, t.complete_date from " + table + " t JOIN" +
    " departments d on (t.department = d.id) JOIN users a on (t.altered_by = a.id) JOIN users b on" +
    " (t.assigned_to = b.id) WHERE";

  if ( filters.department != null ) {
    query.concat( " department = '" + filters.dept + "' AND" );
  }

  if ( filters.priority != null ) {
    query.concat( " priority = '" + filters.priority + "' AND" );
  }

  if ( filters.assignedTo != null ) {
    query.concat( " assigned_to = '" + filters.assignedTo + "' AND" );
  }


  if ( filters.alteredBy != null ) {
    query.concat( " altered_by = '" + filters.alteredBy + "' AND" );
  }


  if ( filters.submittedBy != null ) {
    query.concat( " author = '" + filters.submittedBy + "' AND" );
  }


  if ( filters.clientEmail != null ) {
    query.concat( " author_email = '" + filters.clientEmail + "' AND" );
  }


  // search based on keywords
  var searchWithin = null;
  if ( searchParams.inTitle ) {
    searchWithin = "title";
  } else if ( searchParams.inBody ) {
    searchWithin = "description";
  }

  if ( searchWithin != null ) {
    query.concat( " " + searchWithin + " ~* '(" );

    var keywords = searchParams.keywords.split( " " );
    for ( var i = 0; i < keywords.length; i++ ) {
      query += keywords[x];
      if ( i = !keywords.length - 1 ) {
        query += "|";
      }
    }
    query += ")' AND";
  }

  // filter out by completed or expired
  // if "include", nothing about the query changes because it's already inclusive
  switch ( includeCompleted ) {
    case "excludeCompleted":
      query += " complete_date IS NULL";
      break;
    case "onlyCompleted":
      query += " complete_date IS NOT NULL";
  }

  switch ( includeExpired ) {
    case "excludeExpired":
      query.concat( (includeCompleted == "excludeCompleted" ? " AND" : "") + " CURRENT_DATE <= due_date" );
      break;
    case "onlyExpired":
      query.concat( (includeCompleted == "excludeCompleted" ? " AND" : "") + "CURRENT_DATE > due_date AND complete_date IS NOT NULL" );
      break;
  }

  if ( amount ) {
    query.concat( " LIMIT " + amount );
  }

  query += ";";

  return query;
}
exports.searchForTicketsQuery = searchForTicketsQuery;


/**
 * creates a query to insert a reply into the database
 *
 * @param ticketId the id of the ticket for the reply to be attached to
 * @param user the user posting the reply
 * @param desc the body of the reply
 * @returns {string} a query inserting a new reply into the database.
 */
function newReplyQuery( ticketId, user, desc ) {
  var query = "INSERT INTO replies VALUES ticket_id=" + ticketId + ", user=" + user + ", description=" + desc + ";";
  return query;
}
exports.newReplyQuery = newReplyQuery;


/**
 * Creates a query to get the id of a user from it's name
 *
 * @param name name of the user to get the id of
 * @returns {string} a database query to get the user id from it's name
 * @author John Welker
 * @date 09/05/2014
 */
function getUserId( name ) {
  return "SELECT id FROM users WHERE name='" + name + "';";
}
exports.getUserId = getUserId;


/**
 * Creates a query to get the id of a department from it's name
 *
 * @param name name of the department to get the id of
 * @returns {string} a database query to get the department id from it's name
 * @author John Welker
 * @date 09/05/2014
 */
function getDeptId( name ) {
  return "SELECT id FROM departments WHERE name='" + name + "';";
}
exports.getDeptId = getDeptId;