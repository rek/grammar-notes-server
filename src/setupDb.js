let setup = (pool) => {
	return pool
		.query(`CREATE TABLE IF NOT EXISTS visit (
			date timestamptz,
			ip varchar(20)
		)`)
		.then(() => {
			/**
			* Project
			*
			* EG: Lost Language A
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS project (
				project_id serial PRIMARY KEY,
				project_title varchar(40) NOT NULL UNIQUE,
				date timestamptz
			)`)
				// id bigserial primary key,
		})
		.then(() => {
			/**
			* Item Type
			*
			* EG:
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS itemType (
				item_type_id serial PRIMARY KEY,
				item_type varchar(40) NOT NULL UNIQUE,
				date timestamptz
			)`)
				// id bigserial primary key,
		})
		.then(() => {
			/**
			* Item
			*
			* EG:
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS item (
				item_id serial PRIMARY KEY,
				item_title varchar(40) NOT NULL,
				content text,
				created_at timestamptz,
				updated_at timestamptz,
				type_id integer REFERENCES itemType (item_type_id)
			)`)
				// constraint fk_type
				// 	foreign key (item_type)
				// 	REFERENCES itemType (it_title)
		})
		.then(() => {
				// id bigserial primary key,
			return pool.query(`CREATE TABLE IF NOT EXISTS subItemType (
				sub_item_type_id serial PRIMARY KEY,
				sub_type varchar(40) NOT NULL UNIQUE,
				date timestamptz
			)`)
		})
		.then(() => {
			/**
			* Sub Item
			*
			* EG:
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS subItem (
				sub_item_id serial PRIMARY KEY,
				sub_item_title varchar(40) NOT NULL,
				content text,
				created_at timestamptz,
				updated_at timestamptz,
				sub_type_id integer REFERENCES subItemType (sub_item_type_id)
			)`)
				// id bigserial primary key,
				// constraint fk_type
				// 	foreign key (sub_item_type)
				// 	REFERENCES subItemType (sit_title)
		})
		.then(() => {
			/**
			* Tag
			*
			* EG:
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS tag (
				tag_id serial PRIMARY KEY,
				tag varchar(40) NOT NULL UNIQUE
			)`)
		})
		.then(() => {
			return pool.query(`CREATE TABLE IF NOT EXISTS item_tag (
				tag_id int REFERENCES tag (tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
				item_id int REFERENCES item (item_id) ON UPDATE CASCADE,
				CONSTRAINT item_tag_pk PRIMARY KEY (tag_id, item_id)
			)`)
		})
		.then(() => {
			return pool.query(`CREATE TABLE IF NOT EXISTS sub_item_tag (
				tag_id int REFERENCES tag (tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
				sub_item_id int REFERENCES subItem (sub_item_id) ON UPDATE CASCADE,
				CONSTRAINT sub_item_tag_pk PRIMARY KEY (tag_id, sub_item_id)
			)`)
		})
		.then(() => {
			return pool.query(`CREATE TABLE IF NOT EXISTS attachment (
				filename varchar(40) NOT NULL,
				created_at timestamptz
			)`)
		})
		.then(() => {
			/**
			* Article
			*
			* EG: some pdf
			*/
			return pool.query(`CREATE TABLE IF NOT EXISTS article (
				article_id serial PRIMARY KEY,
				article_title varchar(40) NOT NULL,
				filename varchar(40) NOT NULL,
			)`)
		})
}

export default setup
