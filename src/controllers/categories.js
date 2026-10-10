import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getAllCategoriesWithProjects,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

// Server-side validation rules shared by the create and edit forms
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

// Build a 404 error and hand it to the global error handler
const categoryNotFound = (next) => {
    const err = new Error('Category not found');
    err.status = 404;
    next(err);
};

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategoriesWithProjects();
    const pageTitle = 'Service Categories';

    res.render('categories', { pageTitle, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
        return categoryNotFound(next);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const pageTitle = 'Category Details';

    res.render('category', { pageTitle, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const pageTitle = 'Assign Categories to Project';

    res.render('assign-categories', { pageTitle, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// ---------------------------- Create category ----------------------------

const showNewCategoryForm = (req, res) => {
    const pageTitle = 'Add New Category';

    res.render('new-category', { pageTitle });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.name);
        req.flash('success', 'Category created successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        // 23505 = unique violation (category name already exists)
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect('/new-category');
        }
        throw error;
    }
};

// ----------------------------- Edit category -----------------------------

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
        return categoryNotFound(next);
    }

    const pageTitle = 'Edit Category';

    res.render('edit-category', { pageTitle, categoryDetails });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        const updatedId = await updateCategory(categoryId, req.body.name);

        if (updatedId === null) {
            return categoryNotFound(next);
        }

        req.flash('success', 'Category updated successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect(`/edit-category/${categoryId}`);
        }
        throw error;
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};