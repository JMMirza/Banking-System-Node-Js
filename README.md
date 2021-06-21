Hey there! This is my first Node js application and below I have provided minimum information about it. Please go through it.

This application contains 5 functionalities, 
1. Register user: this function is simple as it is name, we just have to send data from the body and if the data is proper and contains all fields that are required then it will inserted into the mongodb.
2. Login: the user is authenticate by the email address and password then after login the token is generated and send to the user in the header.
3. Add funds: if a user wants to add fund in his account first he has to provide the token to authorize himself and the send amount in the body of the request.
4. Transfer funds: same as the user wants to transfer funds from one account to another, first authorize himself and give the email of receiver and amount to transfer so the transfer is done if two conditions are fulfilled that receiver should exits and amount must be smaller than the send bank balance
5. Forget password: after authorization the password you have send in the body of the request will updated.

********************** DETAILS OF THE PROJECT ***************************

In this project I have created backend of banking system which is in Node Js, in this project you will find out 7 folders:
1. config: which contains all my configuration variables that is used for the JWT.
2. Database: contain my database which is in mysql.
3. Middlewares: It contains all my custom middleware such as �auth.js, async.js, error.js� which authorize a user by checking the jwt of it, finding error.
4. Models: in this folder there is our models that is used in our application at this moment there is only one model that is our user, so there is only one file in it.
5. Models: In this i have 3 models files: User, Customer, bank. These files contains scehema and models. 
6. Routes: as the name is telling us it has routes of our application. At this time there are 4 routes in this applications that is 
* Home
* User
* Customer
* Auth
* addAmount
* transferAmt
* forgetPass
* bank
7. Views: it contains our html file that is used to display route of HOME.


