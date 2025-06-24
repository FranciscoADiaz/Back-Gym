const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL) 
 .then(() => {
   console.log('Conexión a la base de datos exitosa');
 })
 .catch((error) => {
   console.error('Error al conectar a la base de datos:', error);
 });
module.exports = mongoose;