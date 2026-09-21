-- ========================================
-- Reset (lets you re-run this file safely)
-- Drop child tables before the tables they reference.
-- ========================================
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS category;
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
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Project/Category Junction Table
-- Models the many-to-many relationship:
--   a project can have many categories, and
--   a category can have many projects.
-- The composite primary key (project_id, category_id) prevents
-- linking the same project to the same category twice.
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL
        REFERENCES project (project_id)
        ON DELETE CASCADE,
    category_id INTEGER NOT NULL
        REFERENCES category (category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- The composite primary key already speeds up lookups by project_id.
-- This index speeds up lookups by category_id (e.g., "all projects in a category").
CREATE INDEX idx_project_category_category_id ON project_category (category_id);

-- ========================================
-- Associate projects with categories
-- Project titles and category names are used to look up the ids,
-- so this doesn't depend on the ids being in any particular order.
-- Every project gets at least one category; several get two.
-- ========================================
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM (
    VALUES
    -- BrightFuture Builders
    ('Community Playground Build', 'Community Service'),
    ('Community Playground Build', 'Environmental'),
    ('Senior Home Ramp Repair', 'Community Service'),
    ('Senior Home Ramp Repair', 'Health and Wellness'),
    ('Bus Stop Shelter Project', 'Community Service'),
    ('Community Center Roof Patch', 'Community Service'),
    ('Garden Bridge Construction', 'Community Service'),
    ('Garden Bridge Construction', 'Environmental'),

    -- GreenHarvest Growers
    ('Fall Harvest Festival', 'Community Service'),
    ('Fall Harvest Festival', 'Health and Wellness'),
    ('Composting Workshop', 'Environmental'),
    ('Composting Workshop', 'Educational'),
    ('Rooftop Garden Planting Day', 'Environmental'),
    ('Kids Seed-Starting Class', 'Educational'),
    ('Spring Orchard Planting', 'Environmental'),
    ('Spring Orchard Planting', 'Community Service'),

    -- UnityServe Volunteers
    ('Food Pantry Sorting Day', 'Community Service'),
    ('Food Pantry Sorting Day', 'Health and Wellness'),
    ('Winter Coat Drive', 'Community Service'),
    ('Winter Coat Drive', 'Health and Wellness'),
    ('Holiday Meal Delivery', 'Community Service'),
    ('Holiday Meal Delivery', 'Health and Wellness'),
    ('Neighborhood Cleanup Day', 'Environmental'),
    ('Neighborhood Cleanup Day', 'Community Service'),
    ('Volunteer Orientation & Resource Fair', 'Educational'),
    ('Volunteer Orientation & Resource Fair', 'Community Service')
) AS v (project_title, category_name)
JOIN project p ON p.title = v.project_title
JOIN category c ON c.name = v.category_name;

-- ========================================
-- Verify the data
-- ========================================
-- Projects with their organization and categories:
-- SELECT p.project_date, p.title, o.name AS organization,
--        STRING_AGG(c.name, ', ' ORDER BY c.name) AS categories
-- FROM project p
-- JOIN organization o ON p.organization_id = o.organization_id
-- JOIN project_category pc ON p.project_id = pc.project_id
-- JOIN category c ON pc.category_id = c.category_id
-- GROUP BY p.project_id, p.project_date, p.title, o.name
-- ORDER BY p.project_date;
--
-- Any project with NO category (should return 0 rows):
-- SELECT p.title FROM project p
-- LEFT JOIN project_category pc ON p.project_id = pc.project_id
-- WHERE pc.project_id IS NULL;