import { getProjectDetails } from '../models/projects.js';
import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

// Only allow redirecting back to the dashboard; anything else goes to the project page
const getRedirectPath = (req, projectId) => {
    return req.body.returnTo === 'dashboard' ? '/dashboard' : `/project/${projectId}`;
};

const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash('error', 'Service project not found.');
            return res.redirect('/projects');
        }

        await addVolunteer(userId, projectId);

        req.flash('success', `You are now volunteering for "${project.title}".`);
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error signing up to volunteer:', error);
        req.flash('error', 'There was an error signing you up to volunteer.');
        res.redirect(`/project/${projectId}`);
    }
};

const processVolunteerRemoval = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(userId, projectId);

        req.flash('success', 'You have been removed as a volunteer from that project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing you as a volunteer.');
    }

    res.redirect(getRedirectPath(req, projectId));
};

export { processVolunteerSignup, processVolunteerRemoval };