
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const port = 5000
const app = express();
const billRoutes = require('./routes/bills.routes')
const productRoutes = require('./routes/productInfo.routes')

const lotRoutes=require("./routes/lot.routes")

const productRoutes_v1 = require('./routes/productinfo_v1.routes')


// const billItemsRoutes = require('./routes/billItems.routes')

app.use(express.json())
app.use(cors())
app.use('/bills',billRoutes)
app.use('/api/products',productRoutes)




// app.use('/billItems',billItemsRoutes)
// lot


app.use("/api/v1/lot",lotRoutes)

app.use('/api/v1/products',productRoutes_v1)



app.listen(port, () => {
    console.log("Server is Running on " + port)
} )
