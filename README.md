# nodejs-blog
<strong>Node.js Blog Script v1</strong>

<p>-Single Post Page</p>
<p>-Register/Login Page</p>
<p>-Add Post Page</p>
<p>-Edit/Delete Post Page</p>
<p>-Add/Delete Category Page</p>
<p>-Post Thumbnail</p>
<p>-Categories Widget</p>
<p>-Latest Post Widget</p>
<p>-Session, middleware ...</p>


<h1>Installing</h1>
The program needs a server that supports the MongoDB [11] database and Node.js [12]. When a server that provides these features is available, files are transferred to the server and database file are organized. The software will then be ready for use. The "app.js" file inside the files will open to edit the database fragment. The database connection can be made by changing the "mongodb: //127.0.0.1/nodejsblog" section just below the database comment line. After the software is installed on the server, the user will be registered from the "register" page. If the "isadmin" value of the user registered through the database is set to "1", the user takes the "Administrator" position and provides access to the admin panel.
<h1>Built With</h1>

Body Parser[1], Express[2], Express-Handlebars[3], Express-FileUpload[4], Express-Session[5], Method-Override[6], Moment[7], Mongoose[8], Random-Int[9], Url-Slug[10], MongoDB[11], Node.js[12]

