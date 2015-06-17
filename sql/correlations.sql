select
  regr_intercept(a.b23001e103::numeric, b.b27001e16::numeric) as r
from
  x27_health_insurance b
join x23_employment_status a on a.geoid = b.geoid
