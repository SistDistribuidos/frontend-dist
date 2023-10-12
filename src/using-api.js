const apiUrl = 'http://192.168.100.13/api/get-users';
const axios = require('axios');

const users = async ()=>{

 

    // URL de la API que deseas consumir
    // Reemplaza con la URL de la API que quieras utilizar
    
    // Realiza la solicitud GET a la API
    axios.get(apiUrl)
      .then(function (response) {
        // La solicitud fue exitosa, y los datos de la respuesta están en response.data
        console.log('Datos de la respuesta:', response.data);
      })
      .catch(function (error) {
        // Ocurrió un error en la solicitud
        console.error('Error al realizar la solicitud:', error);
      });

    

}


module.exports = {
    users
}


