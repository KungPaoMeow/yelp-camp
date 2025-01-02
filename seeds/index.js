const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    console.log('Deleting old campgrounds...');
    for (let i = 0; i < 300; i++) {
        const randCity = sample(cities);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '677426bb345b24d13be55d8f',   // some seed user
            location: `${randCity.city}, ${randCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dyxapvj0h/image/upload/v1735688093/ahfnenvca4tha00h2ubt_phc4gu.png',
                    filename: '_YelpCamp/ahfnenvca4tha00h2ubt_phc4gu'   // incorrect to avoid deletion from Cloudinary
                },
                {
                    url: 'https://res.cloudinary.com/dyxapvj0h/image/upload/v1735688093/ruyoaxgf72nzpi4y6cdi_as6kfl.png',
                    filename: '_YelpCamp/ruyoaxgf72nzpi4y6cdi_as6kfl'   // incorrect to avoid deletion from Cloudinary
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, sapiente possimus. Quam dignissimos eum quod maxime suscipit dolore! Perspiciatis esse rem eligendi, provident libero similique commodi sequi nam totam amet!',
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [randCity.longitude, randCity.latitude]
            }
        });
        await camp.save();
    }
    console.log('Added seed campgrounds');
}

seedDB().then(() => {
    db.close();
});