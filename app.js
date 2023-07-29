const express = require("express");

const app = express();

const fs = require("fs");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testing...");
});

app.get("/api/customers", (req, res) => {
  fs.readFile("customers.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading the JSON file." });
    }

    const customerData = JSON.parse(data);
    res.json(customerData);
  });
});

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

app.post("/api/customers", (req, res) => {
  try {
    const newCustomer = req.body;

    if (!newCustomer || !newCustomer.Name || !newCustomer.Gender) {
      res
        .status(400)
        .json({ error: "Invalid data format. Name and gender is required." });
    }

    fs.readFile("customers.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "Error reading the JSON file." });
      }

      const customerData = JSON.parse(data);
      const Customers = customerData.Customers;

      const newCustomerData = {
        ID: Customers.length + 1,
        Name: newCustomer.Name,
        Gender: newCustomer.Gender,
      };

      Customers.push(newCustomerData);

      fs.writeFile(
        "customers.json",
        JSON.stringify(customerData, null, 2),
        (err) => {
          if (err) {
            res.status(500).json({ error: "Error writing to the JSON file." });
          }

          res.json(newCustomerData);
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/api/customers/:ID", (req, res) => {
  const customer = customers.find((i) => i.ID === parseInt(req.params.ID));
  if (!customer) res.status(404).send("The customer does not exist");
  const { Name, Gender } = req.body;
  if (Name) customer.Name = req.body.Name;
  if (Gender) customer.Gender = req.body.Gender;
  res.send(customer);
});

app.delete("/api/customers/:ID", (req, res) => {
  const customer = customers.find((i) => i.ID === parseInt(req.params.ID));
  if (!customer) res.status(404).send("The customer does not exist");

  const index = customers.indexOf(customer);
  customers.splice(index, 1);
  res.send(customer);
});

app.listen(3000, () => console.log(`Server running on port:3000`));
