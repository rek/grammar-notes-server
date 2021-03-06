/* eslint no-path-concat: false */

import pg from 'pg'
import express from 'express'
import cors from 'cors'

// import fs from 'fs'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import setupDB from './setupDb.js'
import config from './config.js'
import itemEndpoints from './item/handlers.js'
import tagEndpoints from './tag/handlers.js'

Object.assign = require('object-assign')

let app = express()
let Pool = pg.Pool

// import eps from 'ejs'
app.engine('html', require('ejs').renderFile)
app.use(morgan('combined'))

app.set('views', __dirname)
app.use('/favicon.ico', express.static(__dirname + '/favicon.ico'))

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// create the pool somewhere globally so its lifetime
// lasts for as long as your app is running
// uses vars from env
let pool = new Pool()

// let handleError = (error, res) => {
// 	// console.log(error.message, error.stack)
// 	res.writeHead(500, {'content-type': 'text/plain'})
// 	// res.status(code || 500).json({'error': message})
// 	console.error('Error:', error)
// 	console.error('res:', res)

// 	res.send('Error:', error.stack)

// 	res.end('An error occurred')
// }

config.devMode && console.log('Init stage:', 1);

let runServer = () => {
	pool.connect(function(err, client, done) {

		if(err) {
			return console.error('Error fetching client from pool', err);
		}

		setupDB(client)
			.then(() => {
				console.log('DB Initialized, starting server.')
				config.devMode && console.log('Init stage:', 2);

				if (config.devMode) {
					console.log('Loading CORS Headers...');
					app.use(cors());

					// Add CORS headers - DEV
					// app.use(function (req, res, next) {
					// 	// Website you wish to allow to connect
					// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8090');

					// 	// Request methods you wish to allow
					// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

					// 	// Request headers you wish to allow
					// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

					// 	// Set to true if you need the website to include cookies in the requests sent
					// 	// to the API (e.g. in case you use sessions)
					// 	res.setHeader('Access-Control-Allow-Credentials', true);

					// 	// Pass to next layer of middleware
					// 	next();
					// });
				}

				let errorHandler = (err, req, res, next) => {
					res.status(500);
					res.send({error: err});
				}

				itemEndpoints(app, pool, errorHandler)
				tagEndpoints(app, pool, errorHandler)

				// so all routes after we have attached api routes
				app.get('/health', function(req, res) {
					res.send('OK')
				})

				app.get('/', function(req, res) {
					res.send('THIS IS THE API FOR: <a href="https://grammar-manager.herokuapp.com">https://grammar-manager.herokuapp.com</a>')
				})

				// log errors
				app.use((err, req, res, next) => {
					console.error(err.stack);
					next(err);
				});

				// error handling (clientErrorHandler)
				app.use((err, req, res, next) => {
					if (req.xhr) {
						res.status(500).send({ error: 'Something failed!' });
					} else {
						next(err);
					}
				});

				app.use(errorHandler);

				config.devMode && console.log('Init stage:', 3);

				let server = app.listen(config.port, () => {
					let address = server.address()

					console.log(`Server now running on: ${address.address}:${address.port}`);
				});

				// app.listen(config.port, config.ip)
				// console.log('Server running on http://%s:%s', config.ip, config.port)
			})
			.catch((error) => {
				console.log('Error:', error)

				// if error is not catastropic, restart:
				if (false) {
					runServer()
				}
			})
	})
}

runServer()

export default app
