
const express = require("express");
const bodyParser = require("body-parser");
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

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.get("/", (req, res)=>{
    res.send("GROUP 4 HACAKATHON API");
});

//returns the agent name that sold a particular property
app.post("/getAgent", async (req, res)=>{
    console.log(req.body);
    const propertyName = req.body.propertyName;
    try{
        const result = await db.query("SELECT id FROM properties WHERE LOWER(property_name) LIKE '%' || $1 || '%'", [propertyName.toLowerCase()]);
        const propertyId = result.rows[0].id;
        try{
            const result = await db.query("SELECT agent_id FROM sold_properties WHERE property_id = $1", [propertyId]);
            const agentId = result.rows[0].agent_id;
            try{
                const result = await db.query("SELECT * FROM agents WHERE id = $1", [agentId]);
                const agent = result.rows[0];
                res.json(agent).status(200);
            }catch(err){
                console.log(err);
                res.json("Agent not found").status(500);
            }
        }catch (err){
            console.log(err);
            res.json("Property hasn't been sold").status(500);
        }
    }catch(err){
        console.log(err);
        res.json("Property doesn't exist").status(500);
    }
});


//returns the names of the properties that has been sold
app.get("/getSold", async (req, res) => {
    // try {
    //     const soldPropertiesResult = await db.query("SELECT property_id FROM sold_properties");
    //     const soldPropertiesIds = soldPropertiesResult.rows.map(row => row.property_id);
    //     const soldProperties = [];
    //     for (const id of soldPropertiesIds) {
    //         try {
    //             const propertyResult = await db.query("SELECT * FROM properties WHERE id = $1", [id]);
    //             //console.log(`Property Result:`, propertyResult);
    //             //console.log(`Property Rows: ${propertyResult.rows}`);
    //             soldProperties.push(propertyResult.rows[0])
    //         } catch (err) {
    //             console.error("Error fetching property:", err);
    //         }
    //     }
    //     //console.log(soldProperties);
    //     res.json(soldProperties).status(200);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json("No properties sold");
    // }
    try {
        const soldPropertiesResult = await db.query("SELECT * FROM sold_properties JOIN properties ON properties.id = property_id JOIN customers ON customers.id = customer_id JOIN agents ON agents.id = agent_id");
        console.log(soldPropertiesResult.rows);
        res.json(soldPropertiesResult.rows).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).json("No properties sold");
    }
});

//returns the number of properties that has been sold
app.get("/getNumSold", async (req, res)=>{
    try{
        const result = await db.query("SELECT COUNT(DISTINCT property_id) AS total_properties_sold FROM sold_properties");
        const numOfProps = result.rows[0].total_properties_sold;
        //console.log(numOfProps);
        res.json(numOfProps);
    }catch(err){
        console.log(err);
        res.json("No property has been sold.");
    }
});

app.get("/getNumRem", async (req, res)=>{
    try{
        const result = await db.query("SELECT COUNT(DISTINCT id) AS total_properties FROM properties");
        console.log(result);
        res.send(200);
    }catch(err){
        console.log(err);
        res.json(err);
    }
})
//returns the prices of properties that has been sold
app.post("/getPrice", async(req, res)=>{
    try{
        const propertyName = req.body.propertyName;
        console.log(propertyName);
        try{
            const result = await db.query("SELECT id from properties WHERE name = $1", [propertyName]);
            const propertyId = result.rows[0].id;
            console.log(propertyId);
            try{
                const result = await db.query("SELECT amount FROM sold_properties WHERE property_id = $1", [propertyId]);
                const amount = result.rows[0].amount;
                res.json(amount).status(200);
            }catch(err){
                console.log(err);
                res.json("Property hasn't been sold yet").statusCode(404);
            }
        }catch(err){
            console.log(err);
            res.json("No such property");
        }
    }catch(err){
        console.log(err);
        res.status(500).json("Property hasn't been bought yet");
    }
});

app.get("/topCustomers", async (req,res)=>{
    try{
        //const result = await db.query("SELECT customer_id, SUM(property_sold_amount) AS total_amount FROM sold_properties GROUP BY customer_id ORDER BY total_amount DESC");
        const result = await db.query("SELECT c.customer_fullname, c.customer_email, SUM(o.property_sold_amount) AS total_amount FROM customers c LEFT JOIN sold_properties o ON c.id = o.customer_id GROUP BY c.id, c.customer_fullname, c.customer_email ORDER BY total_amount DESC")
        console.log(result.rows)
        res.json(result.rows).status(200);
    }catch(err){
        console.log(err);
        res.send(500);
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  