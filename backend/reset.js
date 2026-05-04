require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const hash = await bcrypt.hash('pukai@2005', 12);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'arnabghosal2005@gmail.com' },
    { $set: { password: hash } }
  );
  console.log('Password reset to: pukai@2005');
  process.exit();
});