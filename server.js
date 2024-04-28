const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const pg = require("pg");
const morgan = require("morgan");

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "hackathon",
  password: "postgres123",
  port: 5432
});

db.connect();

app.use(bodyParser.json());
//using morgan for logging purpises
app.use(morgan("tiny"));

//just some stuff on the home route lol
app.get("/", (req, res) => {
  res.send("GROUP 4 HACAKATHON API");
});

//returns the agent that sold a property
app.post("/getAgent", async (req, res) => {
  // console.log(req.body);
  const propertyName = req.body.propertyName;
  try {
    //selects the property id from the property_name
    const result = await db.query(
      "SELECT id FROM properties WHERE LOWER(property_name) LIKE '%' || $1 || '%'",
      [propertyName.toLowerCase()]
    );
    //stores the id in a constant variable
    const propertyId = result.rows[0].id;
    try {
      //selects the agent id from s
      const result = await db.query(
        "SELECT agent_id FROM sold_properties WHERE property_id = $1",
        [propertyId]
      );
      const agentId = result.rows[0].agent_id;
      try {
        const result = await db.query("SELECT * FROM agents WHERE id = $1", [
          agentId
        ]);
        const agent = result.rows[0];
        res.json(agent).status(200);
      } catch (err) {
        console.log(err);
        res.json("Agent not found").status(500);
      }
    } catch (err) {
      console.log(err);
      res.json("Property hasn't been sold").status(500);
    }
  } catch (err) {
    console.log(err);
    res.json("Property doesn't exist").status(500);
  }
});

//gets all the properties that has been sold and everything relating to the property
//returns even the customers and agents involved with the property and the profits also
app.get("/getSold", async (req, res) => {
  try {
    const soldPropertiesResult = await db.query(
      "SELECT * FROM sold_properties JOIN properties ON properties.id = property_id JOIN customers ON customers.id = customer_id JOIN agents ON agents.id = agent_id"
    );
    //console.log(soldPropertiesResult.rows);
    res.json(soldPropertiesResult.rows).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("No properties sold");
  }
});

//returns ALL the properties the company has
app.get("/getAll", async (req, res) => {
  try {
    const propertiesResult = await db.query("SELECT * FROM properties");
    //console.log(propertiesResult);
    res.json(propertiesResult.rows).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("No properties sold");
  }
});

//returns the total number of properties the company has
app.get("/getTotalNum", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(DISTINCT id) AS total_properties FROM properties"
    );
    res.json(result.rows[0]).status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//returns the total number of properties the company has sold
app.get("/getNumSold", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(DISTINCT property_id) AS total_properties_sold FROM sold_properties"
    );
    res.json(result.rows[0]).status(200);
  } catch (err) {
    console.log(err);
    res.json("No property has been sold.").status(500);
  }
});

//first it finds the total amount of money each customer has spent, then ranks them in descending order and returns the result
app.get("/topCustomers", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT c.customer_fullname, c.customer_email, SUM(o.property_sold_amount) AS total_amount FROM customers c LEFT JOIN sold_properties o ON c.id = o.customer_id GROUP BY c.id, c.customer_fullname, c.customer_email ORDER BY total_amount DESC"
    );
    //console.log(result.rows)
    res.json(result.rows).status(200);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

//sends a mail to customer
app.post("/sendThanks", (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "dunamisolukayode@gmail.com",
      pass: "zukh tntf zasq oqxb"
    }
  });

  const mailOptions = {
    from: "dunamisolukayode@gmail.com",
    to: `${req.body.customerEmail}`,
    subject: "Thank you for your patronage 🥳🚀",
    text: `
            Dear ${req.body.customerName},

            We extend our deepest gratitude for choosing Dovec Ventures for your recent purchase of ${req.body.propertyName}. We are truly honored to have been part of this journey with you. At Dovec Ventures, our commitment to exceptional service is unwavering, and your trust in our team reinforces our dedication to excellence. We are confident that your new property will bring you joy, comfort, and prosperity for years to come, and we remain at your service for any assistance you may require in the future. Thank you for choosing Dovec Ventures.

            Warm regards,
            Team 4
            Dovec Ventures
        `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
  res.send(200);
});

//adds a new property to the database
app.post("/setProperty", async (req, res) => {
  try {
    const name = req.body.name;
    const locationLat = req.body.locationLat;
    const locationLong = req.body.locationLong;
    const costPrice = req.body.costPrice;
    const sellingPrice = req.body.sellingPrice;
    const result = await db.query(
      "INSERT INTO properties (property_name, property_location_lat, property_location_long, property_expected_cost_price, property_expected_selling_price) VALUES ($1, $2, $3, $4, $5)",
      [name, locationLat, locationLong, costPrice, sellingPrice]
    );
    res.json("Success, added properties to database").status(200);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
