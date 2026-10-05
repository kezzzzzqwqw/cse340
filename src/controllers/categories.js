// Import any needed model functions
import { getAllCategoriesWithProjects } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategoriesWithProjects();
    const pageTitle = 'Service Categories';

    res.render('categories', { pageTitle, categories });
};

// Export any controller functions
export { showCategoriesPage };