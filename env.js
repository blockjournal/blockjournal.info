const isDevelopment = window.location.origin.includes('localhost:')

const accountProduction = 'GDTDVL2ZKADQEQ2IP5OKQ5L6PMK5O7BXYAFPFPGE52IMADXAGCNQ5QXI'

let config
if (isDevelopment) {
    config = {
    }
} else {
    config = {
    }
}

if (!isDevelopment) {
    const $els = document.querySelectorAll('[testnet]')
    $els.forEach($el => {
	$el.setAttribute('account-id', accountProduction)
	$el.removeAttribute('testnet')
    })
}

export default {}
