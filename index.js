// Import required modules
const express = require('express');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Initialize express
const app = express();
const PORT = 3000;

// Configure chart size
const width = 800;
const height = 600;
const chartCallback = (ChartJS) => {
  ChartJS.defaults.font.family = 'Arial';
  ChartJS.defaults.font.size = 16;
};

// Create ChartJSNodeCanvas instance
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

// Function to generate chart configuration
const getChartConfig = (type) => {
  return {
    type,
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          data: [10, 20, 15, 30, 25, 40],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Monthly Sales Data' },
      },
    },
  };
};

// Route to generate and return a chart as an image
app.get('/chart/:type', async (req, res) => {
  const chartType = req.params.type;
  const validTypes = ['line', 'bar', 'radar', 'pie', 'doughnut'];

  if (!validTypes.includes(chartType)) {
    return res.status(400).send('Invalid chart type. Use: line, bar, radar, pie, or doughnut.');
  }

  try {
    const config = getChartConfig(chartType);
    const image = await chartJSNodeCanvas.renderToBuffer(config);

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    res.status(500).send('Error generating chart');
  }
});

// Route for the homepage
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Chart Generator</h1>
    <p>Available chart types: line, bar, radar, pie, doughnut</p>
    <p>Example: <a href="/chart/line">/chart/line</a></p>
  `);
});

// Not found route
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



