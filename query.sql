UPDATE sold_properties AS sp
SET profits = sp.property_sold_amount - p.property_expected_cost_price
FROM properties AS p
WHERE sp.property_id = p.id;