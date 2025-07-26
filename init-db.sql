-- Create the ebay schema
CREATE SCHEMA IF NOT EXISTS ebay;

-- Grant permissions to the postgres user
GRANT ALL PRIVILEGES ON SCHEMA ebay TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ebay TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ebay TO postgres;