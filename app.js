const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // assign a unique ID for each Product

const cors = require('cors'); // To be removed later

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());  // To be removed later

// Read products data from JSON file on disk
let products = [];
fs.readFile('products.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    products = JSON.parse(data);
  }
});

// Health endpoint
app.get('/api/health', cors(), (req, res) => {
  res.sendStatus(200);
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by ID
app.get('/api/products/:productId', (req, res) => {
  const product = products.find(p => p.productId === req.params.productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  const { productName, productOwnerName, Developers, scrumMasterName, startDate, methodology } = req.body;

  if (!productName || !productOwnerName || !Developers || !scrumMasterName || !startDate || !methodology) {
    res.status(400).json({ message: "Please provide all required fields" });
    return;
  }

  const newProduct = {
    productId: uuidv4(),
    productName,
    productOwnerName,
    Developers,
    scrumMasterName,
    startDate,
    methodology
  };

  products.push(newProduct);

  // Write updated products data to JSON file on disk
  fs.writeFile('products.json', JSON.stringify(products), err => {
    if (err) {
      console.error(err);
    }
  });

  res.status(201).json(newProduct);
});

// PUT endpoint to update an existing product
app.put('/api/products/:productId', (req, res) => {
  const { productId } = req.params; // extract product ID from URL parameter
  const { productName, productOwnerName, Developers, scrumMasterName, startDate, methodology } = req.body; // extract product data from request body

  // Find the product by its ID in the products array and update its properties
  const product = products.find(p => p.productId === productId);
  if (!product) {
    return res.status(404).send(`Product ID ${productId} not found.`);
  }
  product.productName = productName;
  product.productOwnerName = productOwnerName;
  product.Developers = Developers;
  product.scrumMasterName = scrumMasterName;
  product.startDate = startDate;
  product.methodology = methodology;

  // Write updated products data to JSON file on disk
  fs.writeFile('products.json', JSON.stringify(products), err => {
    if (err) {
      console.error(err);
    }
  });

  res.status(200).send(`Product ID ${productId} has been updated.`);
});

// DELETE endpoint to delete an existing product
app.delete('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const index = products.findIndex(product => product.productId === productId);
  if (index !== -1) {
    products.splice(index, 1);

    // Write the updated products data to a JSON file
    fs.writeFile('./products.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to update products data' });
      } else {
        res.status(204).send();
      }
    });
  } else {
    res.status(404).send({ error: `Product with ID ${productId} not found` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});