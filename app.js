const express = require("express");

const app = express();

const fs = require("fs");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testing...");
});

// Retrieving all customer details
app.get("/api/customers", (req, res) => {
  fs.readFile("customers.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading the JSON file." });
    }

    const customerData = JSON.parse(data);
    res.json(customerData);
  });
});

// Retrieving specific customer details
app.get("/api/customers/:ID", (req, res) => {
  const customerID = parseInt(req.params.ID);

  if (isNaN(customerID)) {
    res.status(400).json({ error: "Invalid data ID provided." });
  }

  fs.readFile("customers.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading the JSON file." });
    }

    const customerData = JSON.parse(data);
    const Customers = customerData.Customers;

    const foundCustomer = Customers.find(
      (customer) => customer.ID === customerID
    );

    if (!foundCustomer) {
      res.status(404).json({ error: "Customer does not exist." });
    }

    res.json(foundCustomer);
  });
});

//Registering new customers
app.post("/api/customers", (req, res) => {
  try {
    const newCustomer = req.body;

    if (!newCustomer || !newCustomer.Name || !newCustomer.Gender) {
      res.status(400).json({ error: "Invalid data format. Name and gender is required." });
    }

    fs.readFile("customers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "Error reading the JSON file." });
      }

      const customerData = JSON.parse(data);
      const Customers = customerData.Customers;

      const maxID = Customers.reduce((acc, item) => Math.max(acc, item.ID), 0);

      const newCustomerData = {
        ID: maxID + 1,
        Name: newCustomer.Name,
        Gender: newCustomer.Gender,
      };

      Customers.push(newCustomerData);

      fs.writeFile(
        "customers.json",
        JSON.stringify(customerData, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Error writing to the JSON file." });
          }

          return res.json(newCustomerData);
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

//Updating customer details 
app.put("/api/customers/:ID", (req, res) => {
  const customerID = parseInt(req.params.ID);
  const updatedCustomer = req.body;

  if (isNaN(customerID)) {
    res.status(400).json({ error: "Invalid data ID provided." });
  }

  fs.readFile("customers.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading the JSON file." });
    }

    const customerData = JSON.parse(data);
    const Customers = customerData.Customers;

    const foundCustomer = Customers.find(
      (customer) => customer.ID === customerID
    );

    if (!foundCustomer) {
      res.status(404).json({ error: "Customer does not exist." });
    }

    if (updatedCustomer.Name) {
      foundCustomer.Name = updatedCustomer.Name;
    }

    if (updatedCustomer.Gender) {
      foundCustomer.Gender = updatedCustomer.Gender;
    }
    
    fs.writeFile('customers.json', JSON.stringify(customerData, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to the JSON file.' });
      }

      return res.json(foundCustomer);
    });
  });
});

//Deleting customer details
app.delete("/api/customers/:ID", (req, res) => {
  const customerID = parseInt(req.params.ID);

  if (isNaN(customerID)) {
    res.status(400).json({ error: "Invalid data ID provided."});
  }

  fs.readFile("customers.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading the JSON file."});
    }

    const customerData = JSON.parse(data);
    const Customers = customerData.Customers;

    const foundCustomer = Customers.find(customer => customer.ID === customerID);

    if (!foundCustomer) {
      return res.status(404).json({ error: "Customer does not exist."});
    }

    const index = Customers.indexOf(foundCustomer);
    const deletedCustomer = Customers.splice(index, 1);

    fs.writeFile("customers.json", JSON.stringify(customerData, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: "Error writing to the JSON file."});
      }

      return res.json(deletedCustomer);
    });
  });
});

app.listen(3000, () => console.log(`Server running on port:3000`));
