# grammar-notes-server

API for Grammar notes

## Database setup and notes:

Install a PG server.

...

Make sure PG is running

See if PG is running by trying to create a db:

```
$ createdb test
$ dropdb test
```

To connect to the db:
```
$ psql -U rekarnar -d grammar
```

To quit:
```
$ test=> \q
```

## Dev:


```
$ gulp start
```

## To run:

```
$ gulp clean && gulp build && node dist/server.js
```

## License

This project is licensed under the MIT license, Copyright (c) 2016 Adam Tombleson. For more information see `LICENSE`.
