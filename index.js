
const balanceText = document.getElementById('total-balance');
const incomeText = document.getElementById('total-income');
const expenseText = document.getElementById('total-expense');
const listElement = document.getElementById('list');
const form = document.getElementById('budget-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


function updateValues() {
    
    const amounts = transactions.map(transaction => transaction.amount);

    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    
    balanceText.innerText = `${total} DH`;
    incomeText.innerText = `+${income} DH`;
    expenseText.innerText = `-${expense} DH`;
}


function addTransactionDOM(transaction) {
    
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)} DH</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Supprimer</button>
    `;

    listElement.appendChild(item);
}


function removeTransaction(id) {
    
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
    init(); 
}


function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Création de l'objet transaction
    const newTransaction = {
        id: Math.floor(Math.random() * 100000000), // ID unique généré aléatoirement
        text: textInput.value,
        amount: parseFloat(amountInput.value)
    };

    transactions.push(newTransaction);

    addTransactionDOM(newTransaction);
    updateValues();
    updateLocalStorage();

    // Reset des inputs du formulaire
    textInput.value = '';
    amountInput.value = '';
});


function init() {
    listElement.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();