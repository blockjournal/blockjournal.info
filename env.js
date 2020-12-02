const isDevelopment = window.location.origin.includes('localhost:')

const accountProduction = 'GA7WQX4CZAEN7NQ4AVHUYGPI7CB5LQ4FVWRBFL2ANIEEIPP2PC3KUM26'

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
