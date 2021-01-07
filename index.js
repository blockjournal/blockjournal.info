import './env.js'
import StellarAccountTransactions from './stellar-account-transactions.js'
import StellarAccountSend from './stellar-account-send.js'

customElements.define('stellar-account-transactions', StellarAccountTransactions)
customElements.define('stellar-account-send', StellarAccountSend)

const setAccountFromUrl = ($element, windowContext) => {
    if (!$element) return
    const searchParams = new URLSearchParams(windowContext.location.search)
    const account = searchParams.get('account')
    if (!account) return
    $element.setAttribute('account-id', account)
}

export {
    setAccountFromUrl
}
