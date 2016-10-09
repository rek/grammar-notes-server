import _ from 'lodash'

export const inserter = (table, items) => {
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

export const updater = (table, pk, pkValue, items = []) => {
	let values = []

	// for (value of items) => {

	// }

	values = items.join(', ')
	// values = unescape(items.join(', '))

	return {
		query: `UPDATE ${table} SET ${values} where ${pk}= ${pkValue}`,
	}
}
