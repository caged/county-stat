Experiment in progress. Inspector for US Census county geographic data.  Brave soul?

#### Requirements

* gdal with filegdb support
* postgis
* postgres

```
createdb my_db
# Don't need PostGIS just yet, but there is geo data involved
psql -c 'create extension postgis' my_db
script/import-psql -d my_db
```
