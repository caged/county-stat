.SECONDARY:
	# http://www2.census.gov/geo/tiger/TIGER_DP/2013ACS/ACS_2013_5YR_COUNTY.gdb.zip

data/gz/tiger/acs_2013_5yr_county.zip:
	mkdir -p $(dir $@)
	curl -L --remote-time 'http://www2.census.gov/geo/tiger/TIGER_DP/2013ACS/ACS_2013_5YR_COUNTY.gdb.zip' -o $@.download
	mv $@.download $@

data/gdb/tiger/acs_2013_5yr_county.gdb: data/gz/tiger/acs_2013_5yr_county.zip
	mkdir -p $(dir $@)
	tar -xzm -C $(dir $@) -f $<
	mv data/gdb/tiger/ACS_2013_5YR_COUNTY.gdb $@
