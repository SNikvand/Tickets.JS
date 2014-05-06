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

/**
 * Purpose makes an insert database query string from a user json object
 *
 * @param jTicket  json object representing a ticket { id, hash, title, author, email, department, description, level }
 * All fields required
 *
 * @return database query string
 */
function newTicketQuery( jTicket ) {
  var query = "INSERT INTO tickets VALUES ( " + jTicket.id + ", " + jTicket.hash + ", " + jTicket.title + ", " + jTicket.author + ", "
    + jTicket.email + ", CURRENT_DATE, " + jTicket.department + ", " + jTicket.description + ", " + jTicket.level + " );";
  return query;
}


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
function modifyTicketQuery( jTicket ) {
  var query = "UPDATE tickets SET ";
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

  for ( var i = 0; i < qParts.length; i++ ) {
    query += qParts[i];
    if ( i < qParts.length - 1 ) {
      query += ", "
    }
  }

  query += " WHERE id='" + jTicket.id + "';";
  return query;
}

/**
 * Purpose makes a insert database query from a user json object
 *
 * @param jUser json object representing a user
 *
 * @return database query string
 */

function newUserQuery( jUser ) {
  var query = "INSERT INTO users VALUES ( " + jTicket.name + ", " + jTicket.email + ", " + jTicket.password + ", "
    + jTicket.type + " );";
  return query;
}




