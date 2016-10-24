# Nova Server

This is the Nova server to create an embeddable passport widget. This widget lives on the lender server ([https://kevins-lender-server.herokuapp.com/](https://kevins-lender-server.herokuapp.com/). Its purpose is to allow Nova to render a Nova Credit Passport form on a lender's web page.

We use React + Redux to handle our form logic, and host it on an Express server.

## Requirements
You will need Node installed. This program expects Node to be installed at `/usr/bin/node`. This
script was tested working on Node v5.10.1 on OSX but is likely to work on most other configurations as well.

## Getting Started
This takes multiple steps to test and run locally. It requires you to also follow steps to get the [lender-server](https://github.com/kevinsuh/lender-server).

Clone this repo and install the dependencies.
```
git clone https://github.com/kevinsuh/nova-server.git
cd nova-server
npm install
```
Before running the server, you'll run a one-time script to load up a local sqlite DB. Once you have your node dependencies installed, simply run:
```
npm run database
```
This will create a `database.sqlite` in the root directory with `requests`, `responses` and `lenders` tables. This will be the information we store for each request / response to our API.

After loading our data, we need to transpile our React app using [webpack](https://webpack.github.io/) and [babel-loader](https://github.com/babel/babel-loader). To do this, run:
```
npm run bundle
```
To recompile on any saved change (for development purposes) you can run:
```
npm run bundle:watch
```
If you run this watch, you will need a separate terminal to run our Express server. 

In order to run this on your local server, you will also need to go to `/client/passport-initialize` and change `novaSource` to `localhost:8080`. Once you have made this change and transpiled the React code, you can run the Express server using:

```
npm run start
```
You can then access the app at `localhost:8080`. This will just be an empty Nova Credit Passport form. It is much more interesting to view on the local server `localhost:3000` (once you have installed the [lender server](https://github.com/kevinsuh/lender-server)). The lender server will pass in the right message to load the embedded form.

## Project Design Decisions
I use Sequelize as an ORM to simplify interaction with our database. I also chose to go with React because it is much simpler than jQuery to generate dynamic HTML content.

The `script` that loads `client/passport-initialize.js` on the lender's server comes with `data-key` and `data-country` attributes because those are necessary elements for our embeddable form. We need to know the country in order to produce a country-specific form, and the public_key is necessary for us to associate an API call with a specific lender.

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
we store our test files in `/test. Currently there is only one file `test.js`. This will run tests to validate our homepage load, and the API calls to retrieve our form and submit the form. It will make sure that requests without a `public_key` get a `401` unauthorized error, and that valid data will lead to expected responses.

## Core Requirements
1. **Create two servers:**
The lender server is a very simple express server. Its main purpose is to run a script to load an iframe that loads the form from Nova's server.
2. **Front-end widget code:**
The lender server will run `/client/passport-initialize.js`, which creates the iframe and loads our react app via `postMessage`. When our react component mounts, we set up an `eventListener`. When it receives the message, it will make a call to our servers to load a country-specific form. It knows which country it is supposed to render for via the `data-country` attribute in the lender's `script` tag. Right now, the country is South Korea and form inputs are simply name, email and passport.
3. **The endpoint on the Nova server:**
When the lender's client submits the form, Nova's server will take the values and 500ms fake data compilation. It will then store the response and send back a `public_token` and public `message`.
4. **Persistence:**
Our `requests` table holds the `LenderId`, the one that associates with `public_key`. It also holds the IP address of the request, if we need to look back in cases of fraud. We store the other form values in that table. The `responses` table holds the `status` of the data compilation (always 200 in this demo), as well as a `public_token` and `creditScore`. The credit score represents private data that we do not want to send over the browser. Instead, we send back a public token, that the lender will then have to use server-side to exchange for the private data.
5. **Parent-child DOM Interaction:**
When we successfully handle the form request, we update the redux state's `passport_form`'s `response` status to 200. When this happens, our react app will `postMessage` back to the lender via `window.parent.postMessage`. We added an `eventListener` in the `initialize-passport.js` file so that the lender's browser can respond to this. It makes sure that the message is coming from the nova's server and is a `200` status.
6. **Comment the code:**
We use `docco` and the HTML renders of our code can be found in `/docs`.
7. **Create small test suites:**
We created some tests using `mocha` and `supertest`. Instructions on how to test can be found above. The main things we test are the API calls. We want to make sure the React app properly generates a form on valid `public_key`, and that we handle the form submission.

## Security Considerations
What were the security considerations? If you did not implement much security, what and how would you implement security for the next step?

The Nova server requires a `public_key` to identify the lender. This allows the lender to keep their client and secret private. We then are able to render a non-sensitive Nova Credit Passport form on their web page and handle submission. When the lender's client submits the form, we take those values to get the private data, store it in our database, and return back a `public_token`. This `public_token` is associated with the call, but is not able to be used for anything. This allows us to communicate back with the lender without having to pass sensitive data over the browser.

The final process would have the lender using the `public_token` to make a server-side request along with its `client` and `secret` to get the data.

We also store the IP address of each request, to have in case of fraud.

The first thing I would implement as the next step would be to sanitize the form inputs. We allow any input to be submitted because this is a demo, but this is a major security and invalid data formatting concern.