import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get every category along with the service projects in it.
 *
 * The query walks the many-to-many relationship:
 *   category -> project_category -> project -> organization
 * LEFT JOIN keeps categories that don't have any projects yet
 * (their project columns come back as NULL).
 *
 * The flat rows are then grouped in JavaScript so each category
 * has a `projects` array the view can loop through.
 */
const getAllCategoriesWithProjects = async () => {
    const query = `
        SELECT
            c.category_id,
            c.name,
            p.project_id,
            p.title,
            p.project_date,
            o.name AS organization_name
        FROM public.category c
        LEFT JOIN public.project_category pc
            ON c.category_id = pc.category_id
        LEFT JOIN public.project p
            ON pc.project_id = p.project_id
        LEFT JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY c.name ASC, p.project_date ASC, p.title ASC;
    `;

    const result = await db.query(query);

    const categories = new Map();

    result.rows.forEach((row) => {
        if (!categories.has(row.category_id)) {
            categories.set(row.category_id, {
                category_id: row.category_id,
                name: row.name,
                projects: []
            });
        }

        // project_id is NULL when the category has no projects
        if (row.project_id !== null) {
            categories.get(row.category_id).projects.push({
                project_id: row.project_id,
                title: row.title,
                project_date: row.project_date,
                organization_name: row.organization_name
            });
        }
    });

    return [...categories.values()];
};



export { getAllCategories, getAllCategoriesWithProjects };