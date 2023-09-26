const numberElement = document.getElementById('number');
const message = document.getElementById('actions');
const button = document.getElementById('init');
let action = false;
let thread = 0;

let users;
fetch('http://127.0.0.1:8000/api/get-users')
.then((res) => {
    if (res.ok)
        res.json().then((value) => {
            users = value.users;
            numberElement.innerHTML = users.length;
    })
});

button.addEventListener('click',() => {
    action = !action;
    loop(users,() => {
        thread = thread + 1;
        const user = getRandomUser();
        payDebt(user.id)
     });
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
    const debts = response.debts;
    if (debts.length == 0)
        return;
    const amount = Math.random()*100;
    const pay = await generatePayment(debts[0].id, amount);
    message.innerHTML = JSON.stringify(pay);
    console.log(thread);
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