-- ========================================
-- Reset (lets you re-run this file safely)
-- Drop the child table (project) before the parent (organization).
-- ========================================
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS organization;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- One organization sponsors many projects (one-to-many).
-- Each project belongs to exactly one organization.
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL
        REFERENCES organization (organization_id)
        ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- Speeds up joins/filters by organization (Postgres does not
-- create an index on a foreign key column automatically).
CREATE INDEX idx_project_organization_id ON project (organization_id);

-- ========================================
-- Insert sample data: Service Projects (5 per organization)
-- The organization name is used to look up the organization_id,
-- so this doesn't depend on the ids being 1, 2, 3.
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
SELECT o.organization_id, v.title, v.description, v.location, v.project_date
FROM (
    VALUES
    -- BrightFuture Builders
    ('BrightFuture Builders', 'Community Playground Build', 'Volunteers assemble a new playground using recycled and sustainable materials.', 'Maple Street Park', DATE '2026-10-10'),
    ('BrightFuture Builders', 'Senior Home Ramp Repair', 'Build and repair wheelchair ramps for elderly homeowners.', 'Various homes in Eastside', DATE '2026-10-24'),
    ('BrightFuture Builders', 'Bus Stop Shelter Project', 'Construct weatherproof shelters at three busy bus stops.', 'Route 12 Transit Corridor', DATE '2026-11-14'),
    ('BrightFuture Builders', 'Community Center Roof Patch', 'Repair leaks and replace damaged shingles on the community center roof.', 'Unity Community Center', DATE '2026-12-05'),
    ('BrightFuture Builders', 'Garden Bridge Construction', 'Build a small pedestrian bridge over the drainage ditch at the community garden.', 'Riverside Community Garden', DATE '2027-02-20'),

    -- GreenHarvest Growers
    ('GreenHarvest Growers', 'Fall Harvest Festival', 'Harvest, sort, and distribute fresh produce to neighbors and local food pantries.', 'Downtown Urban Farm', DATE '2026-10-03'),
    ('GreenHarvest Growers', 'Composting Workshop', 'Learn how to start a compost system at home and help turn the community compost piles.', 'Elm Avenue Community Garden', DATE '2026-10-17'),
    ('GreenHarvest Growers', 'Rooftop Garden Planting Day', 'Plant cool-season vegetables in the new rooftop garden beds.', 'Harbor Street Library Rooftop', DATE '2026-11-07'),
    ('GreenHarvest Growers', 'Kids Seed-Starting Class', 'Hands-on lessons for children on starting seeds indoors for spring planting.', 'Lincoln Elementary School', DATE '2027-01-23'),
    ('GreenHarvest Growers', 'Spring Orchard Planting', 'Plant fruit trees that will supply free fruit to the neighborhood for years to come.', 'Cedar Hill Lot', DATE '2027-03-13'),

    -- UnityServe Volunteers
    ('UnityServe Volunteers', 'Food Pantry Sorting Day', 'Sort and pack donated food items for weekly distribution.', 'Central Food Pantry', DATE '2026-10-08'),
    ('UnityServe Volunteers', 'Winter Coat Drive', 'Collect and distribute warm coats to families in need.', 'Unity Community Center', DATE '2026-11-21'),
    ('UnityServe Volunteers', 'Holiday Meal Delivery', 'Deliver hot holiday meals to homebound seniors and families.', 'Citywide (meet at Central Food Pantry)', DATE '2026-12-19'),
    ('UnityServe Volunteers', 'Neighborhood Cleanup Day', 'Pick up litter and brighten up sidewalks and public spaces.', 'Northside Neighborhood', DATE '2027-01-30'),
    ('UnityServe Volunteers', 'Volunteer Orientation & Resource Fair', 'Meet local charities, learn about volunteer opportunities, and sign up to help.', 'City Hall Plaza', DATE '2027-03-06')
) AS v (org_name, title, description, location, project_date)
JOIN organization o ON o.name = v.org_name;

-- ========================================
-- Verify the data
-- ========================================
-- SELECT p.project_date, p.title, o.name AS organization
-- FROM project p
-- JOIN organization o ON p.organization_id = o.organization_id
-- ORDER BY p.project_date;