'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//funcion to display all the transfers
const displayTransfers = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const movElement = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', movElement);
  });
};

// displayTransfers(account1.movements);

//function to calculater total balance and display it
const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (total, val) {
    return total + val;
  }, 0);
  labelBalance.textContent = `${acc.balance}euro`;
};

// calcAndPrintBalance(account1.movements);

const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val);
  labelSumIn.textContent = income;
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val);
  labelSumOut.textContent = `${Math.abs(outcome)}`;
  //1.2% interst rate for every deposit and giving it if its larger than 1
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(val => (val * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((total, int) => total + int);
  labelSumInterest.textContent = `${Math.abs(interest)}`;
};

// displaySummary(account1.movements);

//function to generate a usernam from the full name
//How to mutate????
const generateUsername = function (accnts) {
  accnts.forEach(function (accnt) {
    accnt.usernme = accnt.owner
      .toLowerCase()
      .split(' ')
      .map(value => {
        return value[0];
      })
      .join('');
  });
};
generateUsername(accounts);

console.log(accounts);

const updateUi = function (acc) {
  //Display movements
  displayTransfers(acc.movements);
  //Display balance
  calcAndPrintBalance(acc);
  //Display summary
  displaySummary(acc);
};

//login function
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('dddddddddddddddddddddddddddd');

  currentAccount = accounts.find(
    acc => acc.usernme === inputLoginUsername.value
  );
  console.log(currentAccount);
  console.log(inputLoginPin.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Login');
    //Display UI and welcome
    containerApp.style.opacity = 100;
    // console.log(currentAccount.owner.split(' ')[]);
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}!`;
    //removing login details
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const sendto = accounts.find(acc => acc.usernme === inputTransferTo.value);
  console.log(amount, sendto);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    sendto &&
    amount > 0 &&
    currentAccount.balance > amount &&
    sendto?.usernme !== currentAccount.usernme
  ) {
    //doing the trasfer
    sendto.movements.push(amount);
    currentAccount.movements.push(-1 * amount);
    console.log(accounts);

    //updating the UI
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    //checking details are correct to delete the user
    currentAccount.usernme === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.usernme === currentAccount.usernme
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
