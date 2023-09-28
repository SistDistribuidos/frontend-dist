


document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const finishButton = document.getElementById('finishButton');
    const next_thread = document.getElementById('next_thread');
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

    next_thread.addEventListener('click', function() {
        run_status = false;
        window.location.href= "simulator.html";
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
        var worker1 = new Worker('js/worker.js');

        // Configura un manejador de mensajes para el worker
        worker1.onmessage = function (e) {
            console.log('Worker1 dijo:', e.data);
        };

        // Envía mensajes al worker para ejecutar diferentes funciones
        worker1.postMessage(users);
        // worker1.postMessage({ comando: 'funcion2', datos: 20 });
    }
    
});



