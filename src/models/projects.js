import db from './db.js';

/**
 * Get every service project along with the name of the organization
 * that sponsors it.
 *
 * JOIN matches each project to its organization using the foreign key
 * (project.organization_id -> organization.organization_id).
 * Projects are returned soonest first.
 */
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC, p.title ASC;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { getAllProjects };