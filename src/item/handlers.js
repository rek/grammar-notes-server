import _ from 'lodash'
import {inserter, updater} from '../utils'

let endpoints = (app, pool, handleError) => {
	let table = 'item'
	let pk = 'item_id'

	app.get('/api/item/:itemId', function(req, res) {
		console.log('[GET] Route matched:', '/api/item/:itemId');
		let query = `SELECT * FROM ${table} where ${pk} = ${req.params.itemId}`
		console.log('Query:', query);

		pool.query(query, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, req, res)
			}

			console.log('Result:', result.rows);

			if (result.rows) {
				let data = _.first(result.rows)
				// console.log('data', data);
				return res.json(data);
			}

			return handleError(err, req, res)

			// working:
			// res.setHeader('Content-Type', 'application/json');
			// res.send(JSON.stringify(result.rows));
			// working:
			// res.json(result.rows);

			// res.status(200)
			// res.send(JSON.stringify(result.rows)) // JSON string on GET
			// res.end()

			// not working:
			// res.writeHead(200, {'content-type': 'application/json'})
			// res.send(JSON.stringify(result.rows)) // JSON string on GET
			// res.end()
		})
	})

	app.put('/api/item/:itemId', function(req, res) {
		console.log('[POST] Route matched:', '/api/item/:itemId');

		let validItems = []

		if (req.body.item_title !== undefined) {
			validItems.push(`item_title = '${req.body.item_title}' `)
		}

		if (req.body.content !== undefined) {
			validItems.push(`content = '${req.body.content}' `)
		}

		if (validItems.length === 0) {
			console.log('NO CONTENT ERROR PLZ');
			return false;
		}

		let sql = updater(table, pk, req.params.itemId, validItems)
		console.log('Query:', sql.query);

		pool.query(sql.query, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, req, res)
			}

			console.log('Result:', result.rows);
			// working:
			// res.setHeader('Content-Type', 'application/json');
			// res.send(JSON.stringify(result.rows));
			// working:
			res.json(result.rows);

			// not working:
			// res.writeHead(200, {'content-type': 'application/json'})
			// res.send(JSON.stringify(result.rows)) // JSON string on GET
			// res.end()
		})
	})

	app.get('/api/items', function(req, res) {
		console.log('[GET] Route matched:', '/api/items');
		pool.query(`SELECT * FROM ${table}`, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, req, res)
			}

			console.log('Result:', result.rows);
			// working:
			// res.setHeader('Content-Type', 'application/json');
			// res.send(JSON.stringify(result.rows));
			// working:
			res.json(result.rows);

			// not working:
			// res.writeHead(200, {'content-type': 'application/json'})
			// res.send(JSON.stringify(result.rows)) // JSON string on GET
			// res.end()
		})
	})

	app.post('/api/items', function(req, res) {
		console.log('[POST] Route matched:', '/api/items');
		console.log('Raw:', req.body);

		let validItems = {}

		// validation
		if (_.isString(req.body.item_title) && req.body.item_title !== '') {
			validItems.item_title = req.body.item_title
		}

		if (_.isString(req.body.content) && req.body.content !== '') {
			validItems.content = req.body.content
		}

		if (_.isEmpty(validItems)) {
			console.log('Empty, should throw error now');
		}

		let sql = inserter(table, validItems)

		pool.query(sql.query, sql.data, (err) => {

			if (err) {
				return handleError(err, req, res)
			}

			res.json({success: true});
		})
	})

	// app.post('/api/visit', function(req, res) {
	// 	// Create a log with request IP and current time of request
	// 	pool.query('INSERT INTO visit (date, ip) VALUES ($1, $2)', [new Date(), req.ip], function(err) {
	// 		res.json({success: true});
	// 	})
	// })
}

export default endpoints
