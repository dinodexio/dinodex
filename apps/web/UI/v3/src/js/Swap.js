document.addEventListener('DOMContentLoaded', function () {
    localStorage.setItem('typeSelectToken', 'sell');
    let dataSave = { 'sell': { name: "Ethereum", logo: "assets/images/swap/logo-token-default.svg", symbol: "ETH" } }
    localStorage.setItem('tokenSelectEd', JSON.stringify(dataSave));
    renderSelectToken()

    const currentPage = window.location.pathname;

    if (currentPage.includes('viewPool')) {
        localStorage.setItem('tokenSelectEd', JSON.stringify({ 'sell': { name: "Ethereum", logo: "assets/images/swap/logo-token-default.svg", symbol: "ETH" }, 'buy': { name: "Wrapped Bitcoin", logo: "assets/images/swap/logo-token-dummy.svg", symbol: "WBTC" } }));
        renderSelectToken()
        activeButtonSwap()
    }

    // click slippage

    let slippage = 0.5

    let slippageItems = document.querySelectorAll('.slippage-item');

    slippageItems.forEach(function (item) {
        item.addEventListener('click', function () {
            slippage = item.getAttribute('data-slippage');
            slippageItems.forEach(function (item) {
                item.classList.remove('slippage-item-active');
            });
            item.classList.add('slippage-item-active');
        });
    });
})

document.addEventListener('modalInsertedswap', function () {
    activeToken();
    let tokenItems = document.querySelectorAll('.list-token-item');
    tokenItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const tokenName = item.getAttribute('data-token');
            const tokenLogo = item.getAttribute('data-logo');
            const tokenSymbol = item.getAttribute('data-symbol');
            saveTokenSelected({
                name: tokenName,
                logo: tokenLogo,
                symbol: tokenSymbol
            });
            resetValueInput()
            Modal.close();
        });
    });
});

const handleChangeInput = (type, event) => {
    let dataSelectToken = JSON.parse(localStorage.getItem('tokenSelectEd'));
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    insuffButton(event.target.value)

    if (type === 'first') {
        let element = document.querySelector(`.swap-item-second`);
        let inputElement = element.querySelector('.swap-item-input');
        if (dataSelectToken['buy']) {
            inputElement.value = (Number(event.target.value) * 3.14);
            let valuePrice = element.querySelector('.value-price');
            if(Number(inputElement.value) > 0){
                valuePrice.style.display = 'block';
            }
        }
    }
    if (type === 'second') {
        if(!dataSelectToken['buy'])return;
        let element = document.querySelector(`.swap-item-first`);
        let inputElement = element.querySelector('.swap-item-input');
        if (dataSelectToken['sell']) {
            inputElement.value = (Number(event.target.value) / 3.14);
            let valuePrice = element.querySelector('.value-price');
            if(Number(inputElement.value) > 0){
                valuePrice.style.display = 'block';
            }
        }
    }

    if (event.target.value !== '') {
        let element = document.querySelector(`.swap-item-${type}`);
        let valuePrice = element.querySelector('.value-price');
        valuePrice.style.display = 'block';
    } else {
        let element = document.querySelector(`.swap-item-${type}`);
        let valuePrice = element.querySelector('.value-price');
        valuePrice.style.display = 'none';
    }
}

const resetValueInput  = () => {
    let inputElements = document.querySelectorAll('.swap-item-input');
    let valuePrice = document.querySelectorAll('.value-price');
    inputElements.forEach(function (item) {
        item.value = '';
    });
    valuePrice.forEach(function (item) {
        item.style.display = 'none';
    });
}

const insuffButton = (value) => {
    let dataSelected = JSON.parse(localStorage.getItem('tokenSelectEd'))
    let buttonSwap = document.querySelector('.button-swap')
    if (Number(value) > 1 && dataSelected['sell'] && dataSelected['buy']) {
        buttonSwap.classList.add('button-swap-disabled')
        buttonSwap.innerHTML = `<span>Insufficient ETH Balance</span>`
    }else if(dataSelected['sell'] && dataSelected['buy']){
        buttonSwap.classList.remove('button-swap-disabled')
        buttonSwap.innerHTML = `<span>Confirm</span>`
    }else{
        buttonSwap.classList.add('button-swap-disabled')
        buttonSwap.innerHTML = `<span>Select a token</span>`
    }
}

const activeButtonSwap = () => {
    let dataSelected = JSON.parse(localStorage.getItem('tokenSelectEd'))

    if (dataSelected['sell'] && dataSelected['buy']) {
        let buttonSwap = document.querySelector('.button-swap')
        buttonSwap.classList.remove('button-swap-disabled')
        buttonSwap.innerHTML = `<span>Confirm</span>`
    }
}


const activeToken = () => {
    const dataSelectToken = JSON.parse(localStorage.getItem('tokenSelectEd'));
    const typeSelectToken = localStorage.getItem('typeSelectToken');
    if (dataSelectToken && typeSelectToken && dataSelectToken[typeSelectToken]) {
        let tokenItems = document.querySelectorAll('.list-token-item');
        tokenItems.forEach(function (item) {
            const tokenName = item.getAttribute('data-token');
            if (dataSelectToken[typeSelectToken]['name'] === tokenName) {
                item.classList.add('list-token-item-active');
            }
        });
    }
}



const saveTypeSelectToken = (type) => {
    localStorage.setItem('typeSelectToken', type);
}



const renderSelectToken = () => {
    let data = JSON.parse(localStorage.getItem('tokenSelectEd'))
    if (!data) return;

    let selectItems = document.querySelectorAll('.swap-item-select');

    selectItems.forEach(function (item) {
        let dataSelect = item.getAttribute('data-select');
        if (data[dataSelect]) {
            item.classList.add('swap-item-select-have-token');
            item.innerHTML = `
            <img src=${data[dataSelect].logo} alt="${data[dataSelect].name}" width="24" height="24">
            <span>${data[dataSelect].symbol}</span>
            <img src="assets/images/icon/drop-down-icon.svg" alt="circle">
        `
        } else {
            item.classList.remove('swap-item-select-have-token');
            item.innerHTML = `
            <span>Select</span>
            <img src="assets/images/icon/drop-down-icon.svg" alt="circle">
        `
        }
    });
}


const saveTokenSelected = (data) => {
    let typeSelectToken = localStorage.getItem('typeSelectToken')
    let dataSave = JSON.parse(localStorage.getItem('tokenSelectEd'))
    if (!typeSelectToken && !data) return;
    dataSave = {
        ...dataSave,
        [typeSelectToken]: data
    }
    localStorage.setItem('tokenSelectEd', JSON.stringify(dataSave));
    renderSelectToken()
    activeButtonSwap()
}


const changeSwap = () => {
    let dataSave = JSON.parse(localStorage.getItem('tokenSelectEd'))
    dataSave = {
        'sell': dataSave['buy'],
        'buy': dataSave['sell']
    }
    localStorage.setItem('tokenSelectEd', JSON.stringify(dataSave));
    renderSelectToken()
}