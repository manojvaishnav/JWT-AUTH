const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Shop')
.then((result) => {
    console.log('Database Connected');
}).catch((err) => {
    console.log('Database not conected');
    console.log(err);
});
