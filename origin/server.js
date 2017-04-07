var http = require('http');
var fs = require('fs');
var path = require('path');
var unames = "";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('myDatabase.db');  


http.createServer(function(request, response) {


if(request.url == '/getData'){

      db.serialize(function() {

                              db.all("SELECT pid,pname,price FROM Cart WHERE uname=(?)",[unames],function(err,rows){
                              var result = JSON.stringify(rows);
                              response.writeHead(200, { 'Content-Type': 'html/json' });
                              response.end('{"Data":'+result+'}');
                              });
                              });

                              }


  if (request.method == 'POST') {
                                  console.log("POSTING DATA");
                                  var body = '';
                                  request.on('data', function (data) { body += data; });
                                  request.on('end', function () 
                                  {
                                      var res = body.split(/[&=]+/);
                                       if(request.url == '/addToCart' & unames != "")
                                    {
                                      db.serialize(function() {
                                                   
                                                          db.run("CREATE TABLE IF NOT EXISTS Cart (pid INTEGER,uname TEXT,pname TEXT,price REAL,PRIMARY KEY(pid,uname))");
       
                                                           var stmt = db.prepare("INSERT INTO Cart (pid,uname,pname,price) VALUES (?,?,?,?)");
                                                           stmt.run(res[1],unames,res[3],res[5]);
        
                                                           stmt.finalize();
       
                                                           });
                                      response.end("Added to Cart");
                                    } 
                                    if( res[0] == "deleteId")
                                                          { 
                                                            db.serialize(function() {
                                                          
                                                           var stmt = db.prepare("DELETE FROM Cart WHERE pid=(?)", res[1]);
                                                           stmt.run();
        
                                                           stmt.finalize();
       
                                                           }); 
                                                        response.end("Deleted from Cart");
                                                      }
                                     
                                     if(res[0] == "uname")
                                      {
                                        
                                           if(res[1] != "" & res[3] !="")
                                           {
                                            
                                                          if(request.url == '/Register')
                                                          { 
                                                           console.log("Success");
                                                           var result="";
                                                           console.log("res[1] :  "+res[1]);
                                                           db.serialize(function() {db.all("SELECT uname FROM Users WHERE uname=(?)",[res[1]],function(err,rows){
                                                                                      result = JSON.stringify(rows); 
                                                                                          unames=res[1];
                                                                                        if(result != "[]")
                                                                                            {response.end("User exists");}
                                                                                         else
                                                                                        {
                                                                                          db.serialize(function() {
                                                                                          db.run("CREATE TABLE IF NOT EXISTS Users (uid INTEGER PRIMARY KEY AUTOINCREMENT,uname TEXT,pwd TEXT)");
                                                                                          var stmt = db.prepare("INSERT INTO Users (uname,pwd) VALUES (?,?)");
                                                                                          stmt.run(res[1],res[3]);
                                                                                          stmt.finalize();
                                                                                                                });
                                                                                          unames=res[1];
                                                                                          response.end("Account created");
                                                                                        }
                                                            
                                                            });}); 

                                                          
                                                            }
                                                            if(request.url == '/SignedIn' & res[1] != "pwd")
                                                            {
                                                               db.serialize(function() {
                                                                                      var result="";
                                                                                      db.all("SELECT * FROM Users Where uname=(?) and pwd=(?)",[res[1],res[3]],function(err,rows){
                                                                                      result = JSON.stringify(rows);
                                                                                      response.writeHead(200, { 'Content-Type': 'text/html' });
                                                                                      console.log("result is"+ result.length);
                                                                                      console.log("result is"+ result);
                                                                                      unames=res[1];
                                                                                                   if (result != "[]")

                                                                                                    {  
                                                                                                     
                                                                                                      response.end("Login Successful");

                                                                                                    }
                                                                                                             else
                                                                                                         response.end("Login Failed");
                                                                                                     });

                                                                                                      });

                                                            }
                                                            if(request.url == '/SignedIn' & res[1] == "pwd")
                                                              response.end("Enter Valid Username and Password");
                                                         }
                                                         else
                                                         { 
                                                       response.end("Enter Valid Username and Password");
                                                     }

                                                      }
                                                      else
                                                     { 
                                                 response.end("Outer Enter valid Username and Password");
                                                    }
                                   
                                  
 

    
                                                            });
                                    }
                                 


var filePath = '.' + request.url;
if (filePath == './')
{
 filePath = 'index.html';
 targetHtml(filePath);
}

if(request.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile(__dirname + '/client.js', function (err, data) {
        if (err) console.log(err);
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(data);
        response.end();
      });

    }
if(request.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile(__dirname + '/styles.css', function (err, data) {
        if (err) console.log(err);
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data);
        response.end();
      });

    }


 function targetHtml(myFilePath)
 { var contentType = 'text/html';
 var filePath = myFilePath;

  console.log("file path is"+filePath);


    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
        
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }


    });
}
}).listen(3000);