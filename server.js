import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
  const pageTitle = 'Organizations';

  const organizations = [
    {
      name: 'Green Earth Alliance',
      description: 'A nonprofit dedicated to local reforestation and clean-water initiatives.',
      image: '/images/green-earth-alliance.jpg'
    },
    {
      name: 'Bright Futures Literacy',
      description: 'Provides free tutoring and books to underserved school districts.',
      image: '/images/bright-futures-literacy.jpg'
    },
    {
      name: 'Community Care Network',
      description: 'Coordinates food banks and shelter support across the region.',
      image: '/images/community-care-network.jpg'
    }
  ];

  res.render('organizations', { pageTitle, organizations });
});

// Service Projects page
app.get('/projects', async (req, res) => {
  const pageTitle = 'Service Projects';

  const projects = [
    {
      name: 'Riverbank Cleanup Day',
      description: 'Volunteers collect litter and restore native plants along the riverbank.'
    },
    {
      name: 'After-School Tutoring',
      description: 'Weekly tutoring sessions for elementary students in math and reading.'
    },
    {
      name: 'Winter Coat Drive',
      description: 'Collecting and distributing warm coats to families in need.'
    }
  ];

  res.render('projects', { pageTitle, projects });
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
  console.log(`Server running at http://localhost:${port}`);
});
