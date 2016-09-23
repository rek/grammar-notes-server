import _ from 'lodash'
import {inserter} from '../utils'

let endpoints = (app, pool, handleError) => {
	let table = 'tag'

	app.get('/api/tags', function(req, res) {
		pool.query(`SELECT * FROM ${table}`, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, res)
			}

			// console.log('Result:', result.rows);
			res.json(result.rows);
		})
	})

	app.post('/api/tags', function(req, res) {
		let validItems = {}

		// console.log('Raw:', req.body);

		// validation
		if (_.isString(req.body.tag) && req.body.tag !== '') {
			validItems.tag = req.body.tag
		}

		let sql = inserter(table, validItems)

		pool.query(sql.query, sql.data, (err) => {
			if (err) {
				// console.log('err.code', err.code);
				// console.log('err', err);
				switch (err.code) {
					case '23505': {
						res.json({error: 'This tag already exists'});
					}
				}

				res.end()
				return
			}

			res.json({success: true});
		})
	})
}

export default endpoints
