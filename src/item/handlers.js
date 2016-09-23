import _ from 'lodash'
import {inserter} from '../utils'

let endpoints = (app, pool, handleError) => {
	let table = 'item'

	app.get('/api/items', function(req, res) {
		pool.query(`SELECT * FROM ${table}`, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, res)
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
		let validItems = {}

		// console.log('Raw:', req.body);

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
				return handleError(err, res)
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
