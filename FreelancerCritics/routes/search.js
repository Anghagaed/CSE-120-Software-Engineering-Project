
/*
// Testing read file
var displaySearchQuery = function(req, res) { 
  var fs = require('fs');
  var exec = require('child_process').exec;
  var y = fs.readFileSync('./views/search1', 'utf8');
  res.write(y);
  var z = fs.readFileSync('./views/search2', 'utf8');
  res.write(z);
  res.end();
  
}
*/
var displaySearchQuery = function(req, res) {
	// Display Result of Query
	if (req.body == undefined || req.body.searchInputs == undefined) {
		// Handle case where request is undefined
		console.log("Error Body or SearchInputs is undefined");
		res.redirect('/');
		return;
	}
	
	var queryString = req.body.searchInputs.toString();
	if (queryString == "") {
		// Handle case where queryString is empty by going back to index
		res.redirect('/');
		return;
	}
	console.log("queryString: " + queryString);
	var queryArray = (queryString.split(" ")).filter(e => e !== "");
	
	
	if (queryArray.length == 0) {
		// Invalid query
		console.log("Query of all spaces");
		res.redirect('/');
		return;
	}
	var i, len;
	for (i = 0, len = queryArray.length; i < len; ++i) {
		console.log("queryArray[" + i + "] is " + queryArray[i]);
	}
	// Handles db operations
	var DB = require('./DBClass.js');
	// Make the new class
	var con = new DB();
	
	// create database connection
	con.OpenConnection(function(err) {
		if(err) throw err;
		console.log("connected!");
	});
  
  
	
	con.Query("USE app_db;", function (err, result) {
    	if (err) throw err;
    	console.log("using app_db");
  	});
	
	con.Query("SELECT * FROM User", function (err, result){
		if(result.length == 0) {
			console.log("Nothing was found");
			res.redirect('/');
			return;
		}
    /*
		var lenR;
		var table = '<table><tr><td>hi I AM AWESOME MUAHAHAHAHHAhdsadhaskdhsakdhsakdhsa!</td></tr></table>';
	
		var header = "<!DOCTYPE html><html><head><!-- Title, Specifications, and Imports --><title>Search Result</title><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\"><script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script></head>";

		var body1 = "<body><table style=\"width:100%\"><tr><th>UserName</th><th>ID</th> <th>Email</th></tr>";
	
		var body2 = "";
	
		var body3 = "</table></body>";
	
		var endHtml = "</html>"
    */
    
    var fs = require('fs');
    var exec = require('child_process').exec;
    
    var read1 = fs.readFileSync('./views/search1', 'utf8');
    var read2 = fs.readFileSync('./views/search2', 'utf8');
    
    var body = "";
    
		for (i = 0, lenR = result.length; i < lenR; ++i) {
			var username = result[i].username;
			var ID = result[i].ID;
			var email = result[i].email;
			
			body = body + "<tr>" + "<th>" + username + "</th>";
			body = body + "<th>" + ID + "</th>";
			body = body + "<th>" + email + "</th>";
			body = body + "</tr>";
			
		}
		var finalHTML = (read1 + body + read2).toString();
		res.send(finalHTML);
	});
	
	// close database connection
	con.CloseConnection(function(err) {
		if (err) throw err;
		console.log("successfully closed");
	});

	console.log("Redirecting back to / after all operations finish");
	//res.redirect('/');
}

module.exports = displaySearchQuery;