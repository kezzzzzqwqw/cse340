import db from './db.js';

/**
 * Sign a user up to volunteer for a project.
 * ON CONFLICT DO NOTHING makes this safe if they click twice.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    const queryParams = [userId, projectId];
    await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} volunteered for project ${projectId}`);
    }
};

/**
 * Remove a user as a volunteer from a project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} removed from project ${projectId}`);
    }
};

/**
 * Check whether a user is already volunteering for a project.
 */
const isUserVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

/**
 * Get all projects a user has volunteered for, soonest first.
 */
const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM volunteer v
        JOIN project p
            ON v.project_id = p.project_id
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_date ASC, p.title ASC;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getVolunteerProjectsByUserId
};