const isDevelopment = window.location.origin.includes('localhost:')

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
	$el.removeAttribute('testnet')
    })
}

export default {}
