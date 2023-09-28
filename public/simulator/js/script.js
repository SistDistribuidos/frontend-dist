


document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const finishButton = document.getElementById('finishButton');
    let textArea = document.getElementById('textArea');
    let quantity_users_head = document.getElementById('quantity_users_head');// cabecera para la cantidad de usuarios
    let users = null;// usuarios
    let run_status= false;

    getUsers();
    
    startButton.addEventListener('click', function() {
        run_status = true;
        // textArea.innerHTML = 'Este es el inicio.';
        run();
    });

    finishButton.addEventListener('click', function() {
        run_status = false;
        // textArea.innerHTML = 'Este es la finalización.';
    });

    // obtiene usuarios
    function getUsers() {
        axios.get('http://backend-dist.test/api/get-users')
        .then(response => {
            console.log('Datos de la respuesta:', response.data.users.length);
            users =  response.data.users;
            quantity_users_head.innerHTML = 'Cantidad de usuarios : '+ users.length;
        })
        .catch(async error => {
            console.error('Ocurrió un error al hacer la solicitud:', error);
            quantity_users_head.innerHTML = 'Cantidad de usuarios : Error al cargar los datos.. Espere unos segundos!!!';
            await wait_time(5000);
            getUsers();
        });
    }
    // recorre while
    async function run(){
        while(run_status){
            let user_random = get_user_id_random();
            // console.log(user_id_random, user_id_random.id);
            let debt = await get_debt(user_random.id).then(async(data)=>{
                console.log(data, 'xd');
                const amount = Math.random()*100;
                let pay = await make_payment(data.id, amount).then((data)=>{
                    console.log(data);
                    
                    textArea.innerHTML = 'Este es el inicio. =>' + data;
                }).catch(async(err)=>{
                    await wait_time(5000)
                    console.error(err, 'xd error');
                    textArea.innerHTML = 'error. espere unos segundos =>' + err;
                });
                // return data;
            }).catch(async(err)=>{

                console.error(err, 'xd error');
                await wait_time(5000);// en caso de haber errores, espera un tiempo antes de volver a ejecutar
                textArea.innerHTML = 'error. espere unos segundos =>' + err;
                // return err;
            });
        }
    }
    
    // get user id randomly
    function get_user_id_random(){
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
});



