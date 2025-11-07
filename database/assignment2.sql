-- Q1 Insert Tony Stark in the table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'IamIronm@n');

-- Q2 Change account type into Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Q3 Delete Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Q4 Update GM Hummer Description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Q5 Joint Vehicles in Sport Category
SELECT i.inv_make,
       i.inv_model,
       c.classification_name
FROM inventory AS i
JOIN classification AS c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Q6 Update records to add 'vehicles' in the path
UPDATE inventory
SET inv_image     = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
