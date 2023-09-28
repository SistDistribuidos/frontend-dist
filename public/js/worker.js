let contador = 0;
let users = null;

function loop(arr, func) {
    let x = 0;
    setInterval(() => {
        func(arr[x]);
        x = x + 1;
        x = x % arr.length;
    },100)
}


self.onmessage = function(event) {
    users = event.data;
    loop(users,() => {
        const user = getRandomUser();
        payDebt(user.id)
     });
}


function getRandomUser() {
    const index = Math.floor(Math.random() * users.length);
    return users[index];
}

async function payDebt(user_id) {
    const response = await getDebt(user_id);
    const debt = response.debt;
    const amount = Math.random()*(debt.amount-debt.amount_paid + 1);
    const pay = await generatePayment(debt.id, amount);
}


async function generatePayment(debt_id, amount) {
   
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
            contador = contador + 1;
            const responseData = {
                data,
                contador
            };
            self.postMessage(responseData);
        return data;
      })
      .catch(error => {
        console.error('Error en la solicitud POST:', error);
        throw error; 
      });
  }

async function getDebt(user_id) {
    
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