// self.onmessage = function (e) {
//     // Realiza el trabajo en segundo plano
//     var result = e.data * 2;
//     self.postMessage(result); // Envía el resultado de vuelta al hilo principal
//   };
  self.onmessage = function (users) {
    // var comando = e.data.comando;
    // var datos = e.data.datos;
    var resultado;

    run(users);

    // Envía el resultado de vuelta al hilo principal
    self.postMessage(resultado);
};

function funcion1(valor) {
    // Realiza la primera función en segundo plano
    return valor * 2;
}

function funcion2(valor) {
    // Realiza la segunda función en segundo plano
    return valor * 3;
}

  
    // recorre while
    async function run(users){
        // while(run_status){
            let user_random = get_user_id_random(users.data);
            console.log('aaaaaaaaaaaaaaaaaad', users.data, user_random);
            let debt = await get_debt(user_random.id).then(async(data)=>{
                console.log(data, 'xd');
                const amount = Math.random()*100;
                let pay = await make_payment(data.id, amount).then((data)=>{
                    console.log(data, 'gooood');
                    let user= search_user_for_id(data.debt.user_id);
                    textArea.innerHTML = 'Ejecutando transaccion. => Pago realizado correctamente <br>  Usuario:  ' 
                        + user.name +' '+ user.last_name +'<br> Monto Pagado: ' 
                        + data.debt.amount_paid + '<br> Monto Total a Pagar: '
                        + data.debt.amount ;
                }).catch(async(err)=>{
                    console.error(err, 'xd error');
                    textArea.innerHTML = 'error. espere unos segundos =>' + err;
                    await wait_time(5000)
                });
                // return data;
            }).catch(async(err)=>{

                console.error(err, 'xd error');
                textArea.innerHTML = 'Ejecutando transaccion. => error esperado. espere unos segundos =>' + err;
                await wait_time(5000);// en caso de haber errores, espera un tiempo antes de volver a ejecutar
                // return err;
            });
        // }
    }
    
    // get user id randomly
    function get_user_id_random(users){
        const index = Math.floor(Math.random() * users.length);
        return users[index];
    }
    
    // get debt randomly
    async function get_debt(user_id){
        return new Promise((resolve, reject) => {
            axios.get(`http://backend-dist.test/api/get-debt?user_id=${user_id}`)
            .then(response => {
                console.log('Datos de la respuesta:', response.data);
                resolve(response.data.debt);
            })
            .catch(error => {
                console.error('Ocurrió un error al hacer la solicitud:', error);
                reject(error)
            });
        });
    }
    
    // make payment
    async function make_payment(debt_id, amount){
        return new Promise((resolve, reject) => {
            axios.post('http://backend-dist.test/api/pay-debt', {
                debt_id: debt_id,
                amount: amount
              })
            .then(response => {
                console.log('Datos de make_payment:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Ocurrió un error al hacer la solicitud make_payment:', error);
                reject(error)
            });
        });
    }
    
    function wait_time(quantity_time) {
        return new Promise((resolve, reject) => {
            // Simulamos una llamada a una API o proceso asíncrono
            setTimeout(() => {
                resolve();
            }, quantity_time); // Simulamos una demora de 1 segundo
        });
    }

    function search_user_for_id(user_id){
        var user = users.find(function(elemento) {
            return elemento.id === user_id;
        });
        return user;
    }