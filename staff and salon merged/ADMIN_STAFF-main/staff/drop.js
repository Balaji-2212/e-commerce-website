const mongoose = require('mongoose');
const Staff = require('./models/Staff');

const mongoURI = 'mongodb://localhost:27017/Srijes';

async function run() {
  try {
    await mongoose.connect(mongoURI);
    const res = await Staff.deleteMany({});
    console.log('Deleted ' + res.deletedCount + ' staff documents');
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}
run();
