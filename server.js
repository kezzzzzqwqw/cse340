import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static middleware to serve CSS, images, and client-side files
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', async (req, res) => {
  const pageTitle = 'Home';
  res.render('index', { pageTitle });
});

// Organizations page
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', {
    pageTitle: 'Organizations',
    title: 'Organizations',
    organizations
});
});

// Service Projects page
app.get('/projects', async (req, res) => {
  try {
    const pageTitle = 'Service Projects';
    const projects = await getAllProjects();

    // Verify the query works (safe to remove once you've confirmed the output)
    console.log(projects);

    res.render('projects', { pageTitle, projects });
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).send('Sorry, something went wrong loading the service projects.');
  }
});

// Service Project Categories page
app.get('/categories', async (req, res) => {
  const pageTitle = 'Categories';

  const categories = [
    'Environmental',
    'Educational',
    'Community Service',
    'Health and Wellness'
  ];

  res.render('categories', { pageTitle, categories });
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});