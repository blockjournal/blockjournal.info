class StellarAccountSend extends HTMLElement {
    constructor() {
	super()
    }

    connectedCallback() {
	this.accountDestination = this.getAttribute('account-destination') || ''
	this.amount = this.getAttribute('amount') || 0
	this.render()
    }

    handleSubmit = async () => {
	let data  = {
	    account: this.account,
	    secret: this.secret
	}
	this.prepareTransaction(data)
	this.createTransaction()
    }

    prepareTransaction = (data) => {
	this.sourceSecretKey = data.secret
	
	try {
	    this.sourceKeypair = StellarSdk.Keypair.fromSecret(this.sourceSecretKey)
	} catch(error) {
	    console.log('error generating keypair', error)
	    return
	}
	
	this.sourcePublicKey = this.sourceKeypair.publicKey()
	this.receiverPublicKey = this.accountDestination

	let serverUrl
	this.getAttribute('dev') ? (
	    serverUrl = 'https://horizon-testnet.stellar.org'
	) : (
	    serverUrl = 'https://horizon.stellar.org'
	)

	this.server = new StellarSdk.Server(serverUrl)
    }

    createTransaction = async () => {
	const account = await this.server.loadAccount(this.sourcePublicKey);

	// Right now, there's one function that fetches the base fee.
	// In the future, we'll have functions that are smarter about suggesting fees,
	// e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
	const fee = await this.server.fetchBaseFee();

	const transaction = new StellarSdk.TransactionBuilder(account, {
	    fee,
	    // Uncomment the following line to build transactions for the live network. Be
	    // sure to also change the horizon hostname.
	    // networkPassphrase: StellarSdk.Networks.PUBLIC,
	    networkPassphrase: StellarSdk.Networks.TESTNET
	})
					  .addOperation(StellarSdk.Operation.payment({
					      destination: this.receiverPublicKey,
					      asset: StellarSdk.Asset.native(),
					      // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
					      // the decimal. They are represented in JS Stellar SDK in string format
					      // to avoid errors from the use of the JavaScript Number data structure.
					      amount: this.amount,
					  }))
	// Make this transaction valid for the next 30 seconds only
					  .setTimeout(30)
	// Uncomment to add a memo (https://www.stellar.org/developers/guides/concepts/transactions.html)
	// .addMemo(StellarSdk.Memo.text('Hello world!'))
					  .build();

	// Sign this transaction with the secret key
	// NOTE: signing is transaction is network specific. Test network transactions
	// won't work in the public network. To switch networks, use the Network object
	// as explained above (look for StellarSdk.Network).
	transaction.sign(this.sourceKeypair);

	// Let's see the XDR (encoded in base64) of the transaction we just built
	console.log(transaction.toEnvelope().toXDR('base64'));

	// Submit the transaction to the Horizon server. The Horizon server will then
	// submit the transaction into the network for us.
	try {
	    const transactionResult = await this.server.submitTransaction(transaction);
	    console.log(JSON.stringify(transactionResult, null, 2));
	    console.log('\nSuccess! View the transaction at: ');
	    console.log(transactionResult._links.transaction.href);
	} catch (e) {
	    console.log('An error has occured:');
	    console.log(e);
	}
    }

    handleInputChange = (input) => {
	this[input.target.name] = input.target.value
    }

    render() {
	this.innerHTML = ''

	const $header = document.createElement('header')
	$header.innerHTML = `Send ${this.amount} stellar lumens to account ID: ${this.accountDestination}`
	
	const $form = document.createElement('form')
	$form.addEventListener('submit', event => {
	    event.preventDefault()
	    this.handleSubmit()
	})

	const $inputAccount = document.createElement('input')
	$inputAccount.name = 'account'
	$inputAccount.type = 'text'
	$inputAccount.oninput = this.handleInputChange
	$inputAccount.placeholder = 'Sender Account ID'
	$inputAccount.required = true

	const $inputSecret = document.createElement('input')
	$inputSecret.name = 'secret'
	$inputSecret.type = 'password'
	$inputSecret.oninput = this.handleInputChange
	$inputSecret.placeholder = 'Sender Account Secret'
	$inputSecret.required = true

	const $submitButton = document.createElement('button')
	$submitButton.innerHTML = 'Send payment & post message'
	$submitButton.type = 'submit'
	$submitButton.onclick = () => this.handleSubmit

	$form.appendChild($inputAccount)
	$form.appendChild($inputSecret)
	$form.appendChild($submitButton)
	this.appendChild($header)
	this.appendChild($form)
    }
}

export default StellarAccountSend
