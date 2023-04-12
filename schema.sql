-- to conect the table to the database use psql -d nameofdatabase -f nameofsqlfile (schema.sql)
DROP TABLE IF EXISTS movies;
CREATE TABLE IF NOT EXISTS movies (
    ID SERIAL PRIMARY KEY,
    movieName VARCHAR(255),
    comment VARCHAR(255),
    movieImg VARCHAR(500),
    overView VARCHAR(500)
); 