var adminPriv = ["overview", "viewtickets", "newticket", "searchticket", "newuser", "viewusers", "newdept",
    "viewdepts", "mailsettings", "settings", "restrict", "viewdepts", "newdept"];
var managerPriv = ["overview", "viewtickets", "newticket", "searchticket", "mailsettings", "settings", "restrict"];
var ituserPriv = ["overview", "viewtickets", "newticket", "searchticket", "mailsettings", "settings", "restrict"];


/**
 * whenever a page is accessed, the application checks the current role (via session)
 * against the pageid attempting to be accessed. the function returns false if access is denied,
 * and true if granted. consequences or redirection is up to the caller of the function.
 * @param pageid
 * @param role
 * @returns {boolean}
 * @author Matthew Chan
 * @date 04/30/20144
 */
exports.checkRestriction = function(pageid, role) {
    switch (role) {
        case "Admin":
            if (adminPriv.indexOf(pageid) == -1) {
                return false;
            }
            return true;
        case "Manager":
            if (managerPriv.indexOf(pageid) == -1) {
                return false;
            }
            return true;
        case "IT User":
            if (ituserPriv.indexOf(pageid) == -1) {
                return false;
            }
            return true;
    }
};