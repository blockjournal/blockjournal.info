import StellarAccountTransactions from './stellar-account-transactions.js'
import StellarAccountSend from './stellar-account-send.js'

customElements.define('stellar-account-transactions', StellarAccountTransactions)
customElements.define('stellar-account-send', StellarAccountSend)

const $el = document.querySelectorAll('stellar-account-transactions')
console.log($el)
