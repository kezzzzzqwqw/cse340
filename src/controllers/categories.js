// Import any needed model functions
import {getAllCategoriesWithProjects, getCategoryDetails} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';


// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategoriesWithProjects();
    const pageTitle = 'Service Categories';

    res.render('categories', { pageTitle, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const pageTitle = 'Category Details';

    res.render('category', { pageTitle, categoryDetails, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
