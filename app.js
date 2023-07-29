const express = require("express");

const app = express();

app.use(express.json());

const customers = [
  {
    ID: 1,
    Name: "Wei Yang",
    Gender: "Male"
  },
];

app.get("/", (req, res) => {
  res.send("Testing...");
});

app.get("/api/customers", (req, res) => {
  res.send(customers);
});

app.get("/api/customers/:ID", (req, res) => {
    const customer = customers.find(i => i.ID === parseInt(req.params.ID))
    if (!customer) res.status(404).send("The customer does not exist")
    res.send(customer);
  });

app.post("/api/customers", (req, res) => {
  const customer = {
    ID: customers.length + 1,
    Name: req.body.Name,
    Gender: req.body.Gender
  };
  customers.push(customer);
  res.send(customer);
});

app.put("/api/customers/:ID",(req,res) => {
    const customer = customers.find(i => i.ID === parseInt(req.params.ID))
    if (!customer) res.status(404).send("The customer does not exist")
    const {Name,Gender} = req.body;
    if(Name) customer.Name = req.body.Name;
    if(Gender) customer.Gender = req.body.Gender;
    res.send(customer);
})

app.listen(3000, () => console.log(`Server running on port:3000`));
