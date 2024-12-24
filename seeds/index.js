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
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${randCity.city}, ${randCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, sapiente possimus. Quam dignissimos eum quod maxime suscipit dolore! Perspiciatis esse rem eligendi, provident libero similique commodi sequi nam totam amet!',
            price: price
        });
        await camp.save();
    }
    console.log("Added seed campgrounds");
}

seedDB().then(() => {
    db.close();
});