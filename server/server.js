const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const leaveRoutes = require('./routes/leave');
const Registers = require('./models/registrations');
require('dotenv').config();

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

app.use(cors());
app.use(bodyParser.json())

app.use('/api/leave', leaveRoutes);



//registrations
app.post("/registers", async (req, res) => {  //collection name=std_datails
  const { year,sem,subj, email, name } = req.body;
  const newRegistration = new Registers({year,sem, email, name, subj });
  await newRegistration.save()
      .then(() => {
          console.log(" data saved to database");
          res.status(200).send(" data saved successfully");
      })
      .catch(err => {
          console.error("Error saving  data:", err);
          res.status(500).send("Failed to save  data"); 
      });
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


