const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const product = require('./models/product');
const app = express();

// swagger dependens
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs')

// setup swager
const swaggerDefinition = yaml.load('./docs/swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// import routes
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

require ("dotenv-flow").config();

// parsing param request of JSON
app.use(bodyParser.json())

//db connection
mongoose.connect(
    process.env.DB_HOST
).catch(error => { console.log("Error connecting to MongoDB" + error)});

// check connection
mongoose.connection.once('open', function(){ console.log("Connected successfully to MongoDB")});

// post put delete
app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);

// routes
app.get('/api/welcome', (req, res) => {
    res.status(200).send("Hello welcome");
})


app.get('/api/info', (req, res) => {
    res.status(200).send("Hello this is infoo");
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log("Port is running on " + PORT);

})

module.exports = app;


// chamnge nodjs version to 18.0 from 20.0