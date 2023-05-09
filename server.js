const express = require('express');

const sequelize = require('./connection/db');

const routes = require('./routes');

const app = express();


(async () => {
  await sequelize.sync();
  console.log('Tables synced');
})();


 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routes);

  
  sequelize.sync({ force: false }).then(() => {
    app.listen(3004, () => {
      console.log('Server started on port 3000');
    });
  }).catch((error) => {
    console.log('Error creating category table:', error);
  });

process.on('SIGINT', () => {
    connection.end();
    process.exit();
  });