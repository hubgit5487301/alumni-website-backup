# hubgit5487301.github.io

to run locally follow steps

1.install nodejs use following link

  node.js: <a href="https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi">https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi</a>

2.download and exctract project zip

3.open project folder 

4.create a .env file and enter follow parameters and their values (set port to 8000 if u dont plan on using CORS)
```bash
  Port = 'your port number' (a port number on which u want to run the server eg: 5000)
  mongoURI = 'your mongodb URI' (your mongo db key eg: mongoURI=mongodb+srv://<username>:<password>@cluster0.ddh4n.mongodb.net/<databasename>?retryWrites=true&w=majority&appName=Cluster0 )
  key = 'for session' (any string preferably a random and secure one eg: sdiyc123rF*7902jsv5sdvcwq88082fnp;v)
  service = 'email service' (email service u want to save user feedback at eg: gmail)
  user = 'your email account' (email account eg: 'user@gmail.com')
  pass = 'your gmail app key' (gmail app key or a password for other sevices)
  ```
  <a href ="https://myaccount.google.com/u/1/apppasswords">get gmail app passkey here</a>

4.open terminal in project folder and run following command (this will install all required dependencies)
```bash
npm i 
```
5.type following commmand in terminal to run server
```bash
node server.js
```
6.open a browser window and type following in address bar
```bash
https://loaclhost:<your port number>/
```
