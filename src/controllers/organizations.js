// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const pageTitle = 'Our Partner Organizations';

    res.render('organizations', { pageTitle, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const pageTitle = 'Organization Details';

    res.render('organization', {pageTitle, organizationDetails, projects});
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };