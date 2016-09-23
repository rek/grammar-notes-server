import _ from 'lodash'

let inserter = (table, items) => {
	let validKeys = _.keys(items).join(', '),
		countKeys = _.reduce(items, (results) => {
			results.push('$' + (results.length + 1))
			return results
		}, []).join(', '),
		data = _.values(items)

	return {
		data,
		query: `INSERT INTO ${table} (${validKeys}) VALUES (${countKeys})`,
	}
}

export {inserter}
