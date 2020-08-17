const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB Atlas Database
connectDB();

// init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running ...'));

//  Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));


const PORT = process.env.POST || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));