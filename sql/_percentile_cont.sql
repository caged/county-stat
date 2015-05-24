CREATE OR REPLACE FUNCTION percentile_cont(myarray real[], percentile real)
RETURNS real AS
$$

DECLARE
  ary_cnt INTEGER;
  row_num real;
  crn real;
  frn real;
  calc_result real;
  new_array real[];
BEGIN
  ary_cnt = array_length(myarray,1);
  row_num = 1 + ( percentile * ( ary_cnt - 1 ));
  new_array = array_sort(myarray);

  crn = ceiling(row_num);
  frn = floor(row_num);

  if crn = frn and frn = row_num then
    calc_result = new_array[row_num];
  else
    calc_result = (crn - row_num) * new_array[frn]
            + (row_num - frn) * new_array[crn];
  end if;

  RETURN calc_result;
END;
$$
  LANGUAGE 'plpgsql' IMMUTABLE;
