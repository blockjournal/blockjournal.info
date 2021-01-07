
export default class StellarAccountTransations extends HTMLElement {
    static get observedAttributes() {
	return ['account-id', 'testnet']
    }

    attributeChangedCallback(name, oldValue, newValue) {
	if (name === "account-id" && oldValue != newValue) {
	    this.disconnectData()
	    this.connectData()
	}
    }

    getInitialState = () => {
	this.transactions = []
	this.account = this.getAttribute('account-id') || ''
	this.testnet = this.getAttribute('testnet')

	this.getAttribute('testnet') ? (
	    this.serverUrl = 'https://horizon-testnet.stellar.org'
	) : (
	    this.serverUrl = 'https://horizon.stellar.org'
	)
    }

    connectData = async () => {
	this.getInitialState()
	if (!this.serverUrl || !this.account) return

	this.server = new StellarSdk.Server(this.serverUrl)
	const tx = await this.getAccountTransactions()
			     .then(transactions => {
				 this.connectAccountTransactions(this.handleNewTransaction)
			     }).catch(error => {
				 console.log('Error connecting data', error)
			     })
    }

    disconnectData = () => {
	this.server = null
	this.transactions = null
    }

    getAccountTransactions = async () => {
	var lastCursor = 0
	let response 
	try {
	    response =  await this.server.transactions()
				      .forAccount(this.account)
				      .cursor(lastCursor)
				      .call()
	} catch (error) {
	    console.log(`Error getting transactions for account: ${this.account}`, error)
	    return
	}

	if (!response) return []
	return response.records
    }

    connectAccountTransactions(onmessageCallback) {
	this.transactions = []
	var lastCursor = 0
	this.server.transactions()
	    .forAccount(this.account)
	    .cursor(lastCursor)
	    .stream({
		onmessage: onmessageCallback
	    })
    }

    handleNewTransaction = (tx) => {
	this.transactions.push(tx)
	this.render()
    }
    
    render() {
	this.innerHTML = ''
	const transactions = this.transactions
	const sortedTransactions = transactions
	    .sort((a, b) => {
		return new Date(b.created_at) - new Date(a.created_at);
	    })
	    .filter(transaction => {
		return transaction.memo
	    })

	const $header = document.createElement('header')
	$header.innerHTML = `(wall ${ this.testnet ? 'on testnet' : ''})`

	if (sortedTransactions.length) {
	    $header.title = `Showing transaction messages for Stellar Lumens account ID: ${this.account}`
	} else {
	    $header.title = `No message to display yet... post the first message!`
	}

	this.appendChild($header)

	const $transactions = document.createElement('main')
	sortedTransactions
	    .forEach(transaction => {
		let $transaction = document.createElement('article')
		$transaction.innerHTML = `
		    <cite
			 title="${transaction.created_at}"
			 created-at="${transaction.created_at}"
			 transation-id="${transaction.id}"
			>${transaction.memo}</cite>
		`
		$transactions.appendChild($transaction)
	    })
	this.appendChild($transactions)
	
    }
}
