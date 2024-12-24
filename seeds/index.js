const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    console.log("Deleting old campgrounds...");
    for (let i = 0; i < 50; i++) {
        const randCity = sample(cities);
        const camp = new Campground({
            location: `${randCity.city}, ${randCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
    console.log("Added seed campgrounds");
}

seedDB().then(() => {
    db.close();
});