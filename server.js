
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.get("/", (req, res)=>{
    res.send("GROUP 4 HACAKATHON API");
});

app.post("/getAgent", async (req, res)=>{
    console.log(req.body);
    const propertyName = req.body.propertyName;
    try{
        const result = await db.query("SELECT id FROM properties WHERE LOWER(name) LIKE '%' || $1 || '%'", [propertyName.toLowerCase()]);
        const propertyId = result.rows[0].id;
        console.log(propertyId);
        try{
            const result = await db.query("SELECT agent_id FROM sold_properties WHERE property_id = $1", [propertyId]);
            const agentId = result.rows[0].agent_id;
            console.log(agentId);
            try{
                const result = await db.query("SELECT fullname FROM agents WHERE id = $1", [agentId]);
                const agent = result.rows[0].fullname;
                res.json(agent).status(200);
            }catch(err){
                console.log(err);
                res.json("Agent not found");
            }
        }catch (err){
            console.log(err);
            res.json("Property hasn't been sold");
        }
    }catch(err){
        console.log(err);
        res.json("Property doesn't exist");
    }
});


app.get("/getSold", async (req, res) => {
    try {
        const soldPropertiesResult = await db.query("SELECT property_id FROM sold_properties");
        const soldPropertiesIds = soldPropertiesResult.rows.map(row => row.property_id);
        const soldPropertiesNames = [];
        for (const id of soldPropertiesIds) {
            try {
                const propertyResult = await db.query("SELECT name FROM properties WHERE id = $1", [id]);
                soldPropertiesNames.push(propertyResult.rows[0].name);
            } catch (err) {
                console.error("Error fetching property:", err);
            }
        }
        //console.log(soldPropertiesNames);
        res.json(soldPropertiesNames);
    } catch (err) {
        console.error(err);
        res.status(500).json("No properties sold");
    }
});

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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  