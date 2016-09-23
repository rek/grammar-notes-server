import _ from 'lodash'
import {inserter} from '../utils'

let endpoints = (app, pool, handleError) => {
	let table = 'subItem'

	app.get('/api/subitems', function(req, res) {
		pool.query(`SELECT * FROM ${table}`, function(err, result) {
			// handle an error from the query
			if (err) {
				return handleError(err, res)
			}

			// console.log('Result:', result.rows);
			res.json(result.rows);
		})
	})
}

export default endpoints
