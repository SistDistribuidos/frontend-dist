const numberElement = document.getElementById('number');
const message = document.getElementById('actions');
const button = document.getElementById('init');
const stopButton = document.getElementById('stop');
let action = false;
let threads = [];


let users;
fetch('http://127.0.0.1:8000/api/get-users')
.then((res) => {
    if (res.ok)
        res.json().then((value) => {
            users = value.users;
            numberElement.innerHTML = users.length;
    })
});

const addFilaTable = (tableName, number) => {
  const element = document.createElement('tr');
  const addFila = document.getElementById(tableName);
  const elementTH =  document.createElement('th');
  const elementTH2 =  document.createElement('th');
  elementTH2.id = number;
  elementTH.innerHTML= number;
  element.appendChild(elementTH);
  element.appendChild(elementTH2);
  addFila.appendChild(element);
};


const stopAllAndTerminate = () => {
  threads.forEach((value) => {
    value.terminate();
  });
  threads = [];
}



button.addEventListener('click',() => {
  stopAllAndTerminate();
  document.getElementById('table-element').style.visibility = 'visible';
  const numberThreads = document.getElementById('number-threads');
  document.getElementById('addFila').innerHTML= '';
    for (let index = 1; index <= numberThreads.value; index++) {
      addFilaTable('addFila', index);
      threads[index] = new Worker('/localJs/worker.js');
      threads[index].postMessage(users);
      threads[index].onmessage = function(event){
        document.getElementById(index).innerHTML = event.data.contador;
        console.log(`Hilo ${index}: Nro de transacciones `, event.data);
      }
    }
});

stopButton.addEventListener('click', () => {
  stopAllAndTerminate();
});


function loop(arr, func) {
    let x = 0;
    setInterval(() => {
        func(arr[x]);
        x = x + 1;
        x = x % arr.length;
    },100)
}

function showElement(element) {
    console.log(element);
}

function getRandomUser() {
    const index = Math.floor(Math.random() * users.length);
    return users[index];
}

async function payDebt(user_id) {
    const response = await getDebt(user_id);
    console.log(response)
    const debt = response.debt;
    const amount = Math.random()*(debt.amount-debt.amount_paid + 1);
    console.log('monto pagado ',amount,'\n deuda ',debt.amount);
    const pay = await generatePayment(debt.id, amount);
    message.innerHTML = JSON.stringify(pay);
}


function generatePayment(debt_id, amount) {
   
    const url = 'http://127.0.0.1:8000/api/pay-debt';
  
    
    const data = {
      debt_id: debt_id,
      amount: amount
    };
  
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data) 
    };
  
  
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
       
        return response.json();
      })
      .then(data => {
        
        return data;
      })
      .catch(error => {
        console.error('Error en la solicitud POST:', error);
        throw error; 
      });
  }

function getDebt(user_id) {
    
    const url = `http://127.0.0.1:8000/api/get-debt?user_id=${user_id}`;
  
    
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
       
        return response.json();
      })
      .then(data => {
        
        return data;
      })
      .catch(error => {
        console.error('Error en la solicitud GET:', error);
        throw error; 
      });
  }
