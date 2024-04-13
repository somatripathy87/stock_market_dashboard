const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4010;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stocks');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for your data
const dataSchema = new mongoose.Schema({
    Metadata: {
        Symbol: String,
        Interval: String,
        Timezone: String
    },
    Results: [{
        Date: String,
        Open: Number,
        Close: Number,
        High: Number,
        Low: Number,
        Volume: Number,
        AdjClose: Number
    }]
});

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);

// Route to fetch close price of Google stock on a particular date
app.get('/getClosePrice/:symbol/:date', async (req, res) => {
    try {
        // Get the symbol and date from the route parameters
        const symbol = req.params.symbol;
        const date = req.params.date;

        // Construct the query based on the symbol and date
        const query = {
            'Metadata.Symbol': symbol,
            'Results.Date': date
        };

        // Find the document matching the query
        const data = await Data.findOne(query);

        // Check if data exists
        if (!data) {
            return res.status(404).json({ message: 'Data not found for the given date and symbol' });
        }

        // Extract the close price for the given date
        const result = data.Results.find(result => result.Date === date);

        // Check if close price exists for the given date
        if (!result) {
            return res.status(404).json({ message: 'Close price not found for the given date' });
        }

        // Send the close price in the response
        res.status(200).json({ symbol: symbol, date: date, closePrice: result.Close });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
