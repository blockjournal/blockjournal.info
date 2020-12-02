export default class StellarAccountTransations extends HTMLElement {
    constructor() {
	super()
	console.log('constructor')
    }

    async connectedCallback() {
	this.transactions = []
	this.account = this.getAttribute('account') || ''

	let serverUrl
	this.getAttribute('testnet') ? (
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
	$header.innerHTML = `(wall)`
	$header.title = `Showing transaction messages for Stellar Lumens account ID: ${this.account}`

	this.appendChild($header)

	const $transactions = transactions
	    .sort((a, b) => {
		return new Date(b.created_at) - new Date(a.created_at);
	    })
	    .filter(transaction => {
		return transaction.memo
	    })
	    .forEach(transaction => {
		let $transaction = document.createElement('article')
		$transaction.innerHTML = `
		    <cite
			 title="${transaction.created_at}"
			 created-at="${transaction.created_at}"
			 transation-id="${transaction.id}"
			>${transaction.memo}</cite>
		`
		this.appendChild($transaction)
	    })
	
    }
}
