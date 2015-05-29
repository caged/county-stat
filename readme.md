Inspector for US Census county data. Experimental work-in-progress.

#### Requirements

I've only tested this on a Mac running OS X Yosemite.

* gdal with filegdb support (`brew install gdal --enable-unsupported --with-postgresql`) or [osgeo4mac](https://github.com/OSGeo/homebrew-osgeo4mac#how-do-i-install-these-formulae)
* postgis
* postgres

Create a .env file in the root of the project and add:

```
export COUNTY_STAT_DB_NAME=your_db_name_here
export COUNTY_STAT_DB_PORT=your_db_port_here
```

```
createdb my_db
script/import-psql -d my_db
script/server
```
