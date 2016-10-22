# Nova Server

This is the Nova server to create a passport widget. It is an express server and its main purpose is to use an iframe to create an embeddable widget. This widget can live on another server to securely take in essential personal information to generate a Nova Credit Passport.

This form takes in the parameters from the lender's server to generate the appropriate form. This is dependent on factors like which country the immigrant is from.

We use React + Redux to handle our embedded form logic, and host this on an Express server.

## Requirements
You will need Node installed. This program expects Node to be installed at `/usr/bin/node`. This
script was tested working on Node v5.10.1 on OSX but is likely to work on most other
configurations as well.

## Getting Started

Clone this repo and install the dependencies.
```
git clone https://github.com/kevinsuh/nova-server.git
cd nova-server
npm install
```
Before running the server, this program requires a one-time script to load up a local sqlite DB. Once you have your node dependencies installed, simply run:
```
npm run database
```
This will create a `database.sqlite` with a `requests` table and a `responses` table in the root level of this directory. This will be the information we store on each request to our servers, for analytics purposes as well as maintability / stability monitoring.

After loading our data, we need to transpile our React app, which we do with [webpack](https://webpack.github.io/) and [babel-loader](https://github.com/babel/babel-loader). To do this, run:
```
npm run bundle
```
If you want to reload your dependencies each time you save (for development purposes) you can run:
```
npm run bundle:watch
```
If you run this watch, you will need a separate terminal to run our Express server. Once you have bundled the React code, you can run the Express server using:
```
npm run start
```
You can then access the app at `localhost:8080`.

## Project Design and Features
I use Sequelize as an ORM. This streamlines the process of creating our initial tables and for each query. I mainly chose to go with React, although it was not a requirement, because it is much simpler to generate dynamic HTML content that way. Otherwise, you must either generate HTML on the server-side or create lots of elements using jQuery (yuck).

The React app loads up and makes an immediate load, using the passed in data, to create the customized passport form.
