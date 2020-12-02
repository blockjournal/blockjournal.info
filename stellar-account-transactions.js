export default class StellarAccountTransations extends HTMLElement {
    constructor() {
	super()
	console.log('constructor')
    }

    async connectedCallback() {
	this.transactions = []
	this.account = this.getAttribute('account') || ''

	let serverUrl
	this.getAttribute('dev') ? (
	    serverUrl = 'https://horizon-testnet.stellar.org'
	) : (
	    serverUrl = 'https://horizon.stellar.org'
	)

	console.log(serverUrl)
	this.server = new StellarSdk.Server(serverUrl)
	this.connectAccountTransactions(this.handleNewTransaction)
    }

    handleNewTransaction = (txResponse) => {
	this.transactions.push(txResponse)
	this.render(this.transactions)
    }

    connectAccountTransactions(onmessageCallback) {
	var lastCursor = 0
	this.server.transactions()
	    .forAccount(this.account)
	    .cursor(lastCursor)
	    .stream({
		onmessage: onmessageCallback
	    })
    }
    
    render(transactions) {
	this.innerHTML = ''

	const $header = document.createElement('header')
	$header.innerHTML = `Listing last transactions for: ${this.account}`

	this.appendChild($header)

	const $transactions = transactions.forEach(transaction => {
	    let $transaction = document.createElement('article')
	    $transaction.innerText = transaction.id
	    this.appendChild($transaction)
	})
	
    }
}
