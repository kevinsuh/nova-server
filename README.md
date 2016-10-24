# Nova Server

This is the Nova server to create an embeddable passport widget. This widget lives on the lender server ([https://kevins-lender-server.herokuapp.com/](https://kevins-lender-server.herokuapp.com/)), which renders a Nova Credit Passport form on the lender's web page.

This is built using React, Redux and Express.

## Requirements
You will need Node installed. This program expects Node to be installed at `/usr/bin/node`. This was tested working on Node v5.10.1 on OSX but is likely to work on most other configurations as well.

## Getting Started
Since this is a front-end widget on a lender's server, you need to also install the [lender-server](https://github.com/kevinsuh/lender-server).

To get this installed, clone this repo and install the dependencies.
```
git clone https://github.com/kevinsuh/nova-server.git
cd nova-server
npm install
```
This app uses a sqlite DB. Once you have your node dependencies installed, simply run:
```
npm run database
```
This will create a `database.sqlite` in your root directory with 3 tables: `requests`, `responses` and `lenders`. This will be where we store each request / response to our API.

Next, we need to transpile our React app using [webpack](https://webpack.github.io/) and [babel-loader](https://github.com/babel/babel-loader):
```
npm run bundle
```
To recompile on any saved changes (for development purposes), you can run:
```
npm run bundle:watch
```
If you run this watch, you will need a separate terminal to run the Express server. 

To run this locally, you will also need to go to `/client/passport-initialize` and change `novaSource` to `localhost:8080`. Once you have made this change, you can run the server using:

```
npm run start
```
You can now access the app at `localhost:8080`, but it will be a blank page. This is because this app is an embeddable react app that only renders on the lender's server with [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). You can see the embedded form on the lender's server at `localhost:3000` (after you have followed instructions to install [lender-server](https://github.com/kevinsuh/lender-server)).

## Testing
We use [mocha](https://github.com/mochajs/mocha) and [supertest](https://github.com/visionmedia/supertest) to run our tests. First, install `mocha` as global package:
```
npm install -g mocha
```
To run the tests, you will need this server to be running. Then, simply call `mocha` to run the tests:
```
npm start
mocha
```
We store our test files in `/test`. Currently there is only one file `test.js`, which runs tests to validate the API calls to retrieve our form and to submit the form. It makes sure that requests without a `public_key` get a `401` unauthorized error. It will make sure that valid data returns country-specific form data and returns a `public_token` on form submission.

## Core Requirement Implementation
1. **Create two servers:**
The lender server is a very simple Express server. Its main purpose is to run a `script` to create an iframe that loads the form from Nova's server. The `script` comes with `data-key` and `data-country` attributes because those are necessary elements for our embeddable form. We need to know the country in order to produce a country-specific form, and the public_key is necessary for us to associate API calls with a specific lender.
2. **Front-end widget code:**
The lender server runs `passport-initialize.js`, which creates an iframe and loads the Nova react app via `postMessage`. When our React component mounts, we set up an `eventListener` to it. This allows the lender's web page to `postMessage` to our react app and load up an embedded passport form. Our app knows which country to render for via the `data-country` attribute in the lender's `script` tag. Right now, the country is South Korea and demo form inputs are simply name, email and passport.
3. **The endpoint on the Nova server:**
When the lender's client submits the form, Nova's server will take the values and fake a 500ms data compilation. We demo and store a `creditScore` value to represent the private data that we get from the form submission. We store the response values and send back a `public_token` and public `message`.
4. **Persistence:**
Our `requests` table holds the `LenderId` that associates with `public_key`. It also holds the IP address of the request, to look back in case of fraud. We also store the other form values in that table. The `responses` table holds the `status` of the data compilation (always 200 in this demo), as well as a `public_token` and `creditScore`. The credit score represents private data that we do not want to send over the browser. Instead, we send back a public token, which the lender will then have to exchange server-side (along with their `client` and secret) for the private data. We use [Sequelize](https://github.com/sequelize/sequelize) to speed up our implementation of the DB.
5. **Parent-child DOM Interaction:**
We have a redux state `PassportForm` that has a `response` property. It has a `status` property that initializes as `null`, but will get updated to `200` on valid form submission. When this happens, our app tells the lender via `window.parent.postMessage` along with a public `message`. We added an `eventLIstener` to the lender's browser in our `initialize-passport.js` file, so that it can respond to this. The message ("Congratulations, you now have a Nova Credit Passport!") will only display on a `200` status.
6. **Comment the code:**
We use `docco` and the HTML renders of our code can be found in `/docs`.
7. **Create small test suites:**
We created some tests using `mocha` and `supertest`. Instructions on how to test can be found above. The main things we test are the API calls. We want to make sure the React app properly generates a form on valid `public_key`, and that we handle the form submission.

## Security Considerations
The Nova server requires a `public_key` to identify the lender. This allows the lender to keep their client and secret private. We then are able to render a non-sensitive Nova Credit Passport form on their web page and handle submission. When the lender's client submits the form, we take those values to get the private data, store it in our database, and return back a `public_token`. This `public_token` is associated with the call, but is not able to be used for anything. This allows us to communicate back with the lender without having to pass sensitive data over the browser.

The final process would have the lender using the `public_token` to make a server-side request along with its `client` and `secret` to get the data.

We also store the IP address of each request, to have in case of fraud.

The first thing I would implement next is sanitizing the form inputs. We allow any input to be submitted because this is a demo, but this is a major security concern and will lead to invalid data formatting.