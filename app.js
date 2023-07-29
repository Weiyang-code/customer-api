const express = require("express");

const app = express();

const customers = [{
    ID : 1,
    Name : "Wei Yang"
}]

app.get("/",(req,res) => {
    res.send("Testing...")
})

app.get("/api/customers",(req,res) => {
    res.send(customers)
})

app.listen(3000, () => console.log(`Server running on port:3000`));