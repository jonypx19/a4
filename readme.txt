# a4
Assignment 4 Repository

**Online Link**: https://hidden-shore-40090.herokuapp.com/
**GitHub Link**: https://github.com/George334456/a4
**Facebook Page**: https://www.facebook.com/Car-Detail-Exchange-310067925993835/

## How to install the web app locally
1. Install node.js (version 4+)
    to check, open the command prompt/ terminal and type "node -v".
2. Download the zip file and extract the contents.
3. Open up the command prompt/terminal and change directories to the a4 folder from the zip file.
4. Type "npm install" in the command prompt/terminal. (install the module dependencies)
5. Install MySQL Community Server here: http://dev.mysql.com/downloads/mysql/
6. After the installation, in the MySQL Workbench, press the big box with “Load instance of MySQL” with the dolphin.
7. In the Menu Bar, click on File -> Run SQL Script… and click on “schema_2.0.sql” and click Run.
8. As a precaution, please create a user in MySQL with username “root” and with an empty string as a password. Run the SQL command 
“SET PASSWORD FOR root@localhost=PASSWORD('');”
9. If you are experiencing errors, please create another user with username: “bf7055f108f91a” and password “8a5f2a1f”
10. Start the MySQL process. (this may require a restart)
11. In the browser, type "npm start" or “**node server.js**”
    If you see the error “Error connecting to the db” please do not hesitate to contact with the authors of this web app.
12. In a browser, go to the URL: http://localhost:3000/
13. The site will now be open. :)


##How to use our app: 

###Creating a user
From the home page, click on “Sign up” in the top right corner.

Or to login with Google sign in, press login on the top right corner and click on the button with the Google logo. Be aware of the fact that **if you did not already sign up with that email, then you can only log on with Google signin and you cannot make another account with that same email.**
###Logging in
This can be done by entering with the email and the password you chose in the sign up process. 
After that, you will be taken to your profile. Here you can update your biography, see comments left on your profile, and see your average vehicle. From your main profile page, you can see a list of users existing in our system in order for you to follow them. Once you follow them, you can view their profile, and leave comments and ratings. You can go to the top navigation bar in order to add contracts, add vehicles, search for contracts, and take contracts for you to fulfil.

A sample login would be Email: "t@t.t", password: "asdfasdf"

###Admin login
If you want to delete users, go to our admin login page with the URL path “/adminlogin” and login with “z@z.z” and password “asdfasdf”.

##Contributors
Name: Ross Bevacqua
CDF: g3bevacq
Email: ross.bevacqua@mail.utoronto.ca

Name: Jonathan Pelastine
CDF: g5jonypx
Email: jonathan.pelastine@mail.utoronto.ca

Name: George Wu
CDF: c4wuhaoz
Email: georgewu.wu@mail.utoronto.ca

Name: Fullchee Zhang
CDF: g5zhangf
Email: fullchee.zhang@mail.utoronto.ca
