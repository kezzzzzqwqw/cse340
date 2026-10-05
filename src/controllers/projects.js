// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Number of upcoming projects to show on the main projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const pageTitle = 'Upcoming Service Projects';

    res.render('projects', { pageTitle, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const pageTitle = 'Service Project Details';

    res.render('project', { pageTitle, project });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };