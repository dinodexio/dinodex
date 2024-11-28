var typePool = 'poolJoin';
var dataPool = {
    'poolJoin': 'dataPoolJoin',
    'poolCreate': 'dataPoolCreate'
}

document.addEventListener('DOMContentLoaded', function () {
    let poolContent = document.querySelector('.pool-content')
    typePool = poolContent ? poolContent.getAttribute('data-type-pool') : 'poolJoin'
    let dataSave = {
        tokenSelectedPool: { 'first': { name: "Ethereum", logo: "assets/images/swap/logo-token-default.svg", symbol: "ETH" } },
        feeTierValue: '1',
        valueMinPrice: { 'first': 0, 'second': 0 }
    }
    localStorage.setItem(dataPool[typePool], JSON.stringify(dataSave));
    renderSelectTokenPool();
    checkSelectedToken()

    // fee-tier 
    let btnEditFeeTier = document.querySelector('.btn-edit-fee-tier')

    btnEditFeeTier && btnEditFeeTier.addEventListener('click', function () {
        if (document.querySelector('.choose-fee-tier-content').classList.contains('choose-fee-tier-content-show')) {
            document.querySelector('.choose-fee-tier-content').classList.remove('choose-fee-tier-content-show');
            btnEditFeeTier.innerHTML = "Edit"
        } else {
            document.querySelector('.choose-fee-tier-content').classList.add('choose-fee-tier-content-show');
            btnEditFeeTier.innerHTML = "Hide"
        }
    })

    let choosseFeeTier = document.querySelectorAll('.choose-fee-tier-item');
    choosseFeeTier.forEach(function (item) {
        item.addEventListener('click', function () {
            let feeTier = item.getAttribute('data-fee-tier');
            choosseFeeTier.forEach(function (item) {
                item.classList.remove('choose-fee-tier-active');
            });
            item.classList.add('choose-fee-tier-active');
            item.querySelector('.tick-icon').style.display = 'block';
            changeFeeTier(feeTier);
        })
    })

    // input min pirce
    let InputMinPrice = document.querySelectorAll('.input-min-join-pool-item');
    InputMinPrice.forEach(function (item) {
        item.value = 0
        item.addEventListener('input', function (event) {
            let inputTypeMinprice = item.getAttribute('data-type-input');
            let dataValueMinPrice = JSON.parse(localStorage.getItem(dataPool[typePool]));
            event.target.value = event.target.value.replace(/[^0-9.]/g, '');
            if (event.target.value !== '') {
                dataValueMinPrice = {
                    ...dataValueMinPrice,
                    valueMinPrice: {
                        ...dataValueMinPrice.valueMinPrice,
                        [inputTypeMinprice]: event.target.value
                    }
                }
                localStorage.setItem(dataPool[typePool], JSON.stringify(dataValueMinPrice));
            }
        })
    })

    // input deposit amounts
    let inputDepositAmounts = document.querySelectorAll('.input-price-deposit-amount');
    inputDepositAmounts.forEach(function (item) {
        item.addEventListener('input', function (event) {
            event.target.value = event.target.value.replace(/[^0-9.]/g, '');
            convertValueDepositAmounts(event.target.value, item.getAttribute('data-type-deposit'))
        })
    })

    // input deposit amounts
    let inputValueCurrent = document.querySelectorAll('.input-value-current');
    inputValueCurrent.forEach(function (item) {
        item.addEventListener('input', function (event) {
            event.target.value = event.target.value.replace(/[^0-9.]/g, '');
            convertValueDepositAmounts(event.target.value, item.getAttribute('data-type-deposit'))
        })
    })

    // click btn approve
    let BtnApprove = document.querySelector('.btn-approve')
    BtnApprove && BtnApprove.addEventListener('click', function () {
        if (BtnApprove.classList.contains('btn-approve-active')) return;
        BtnApprove.innerHTML = `Approving <div class="loader"></div>`
        setTimeout(function () {
            BtnApprove.classList.add('btn-approve-active')
            BtnApprove.innerHTML = `Approved`
            document.querySelector('.btn-prview').classList.remove('button-swap-disabled')
        }, 2000)
    })

    // btn preview
    let btnPreview = document.querySelector('.btn-prview')
    btnPreview && btnPreview.addEventListener('click', function () {
        if (btnPreview.classList.contains('button-swap-disabled')) return;
        Modal.open('modalPreviewPool', 'PreviewPool');
        localStorage.setItem('previewPool', typePool)
    })

})

document.addEventListener('modalInsertedListPool', function () {
    activeTokenPool();
    let tokenItems = document.querySelectorAll('.list-token-item');
    tokenItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const tokenName = item.getAttribute('data-token');
            const tokenLogo = item.getAttribute('data-logo');
            const tokenSymbol = item.getAttribute('data-symbol');
            saveTokenSelectedPool({
                name: tokenName,
                logo: tokenLogo,
                symbol: tokenSymbol
            });
            Modal.close();
        });
    });
});

const convertValueDepositAmounts = (value, type) => {
    if (value === '') return;
    let InputMinPrice = document.querySelectorAll('.input-price-deposit-amount');
    let dataSave = JSON.parse(localStorage.getItem(dataPool[typePool]));
    let dataTokenSelect = dataSave.tokenSelectedPool
    dataTokenSelect[type] = {
        ...dataTokenSelect[type],
        deposit_amount: Number(value)
    }
    InputMinPrice.forEach(function (item) {
        if (type === 'first') {
            if (item.getAttribute('data-type-deposit') !== type) {
                item.value = Number(value) * 3.14
                dataTokenSelect['second'] = {
                    ...dataTokenSelect['second'],
                    deposit_amount: Number(value) * 3.14
                }
            }
        }
        if (type === 'second') {
            if (item.getAttribute('data-type-deposit') !== type) {
                item.value = Number(value) / 3.14
                dataTokenSelect['first'] = {
                    ...dataTokenSelect['first'],
                    deposit_amount: Number(value) / 3.14
                }
            }
        }
    })
    localStorage.setItem(dataPool[typePool], JSON.stringify({
        ...dataSave,
        tokenSelectedPool: dataTokenSelect
    }))
}
const saveTypeTokenPool = (type) => {
    localStorage.setItem('typeTokenPool', type);
}

const saveTokenSelectedPool = (data) => {
    let typeTokenPool = localStorage.getItem('typeTokenPool')
    let dataSave = JSON.parse(localStorage.getItem(dataPool[typePool]))
    if (!typeTokenPool && !data) return;
    localStorage.setItem(dataPool[typePool], JSON.stringify({
        ...dataSave,
        tokenSelectedPool: {
            ...dataSave.tokenSelectedPool,
            [typeTokenPool]: data
        }
    }));
    renderSelectTokenPool();
    checkSelectedToken();
}


const checkSelectedToken = () => {
    let data = JSON.parse(localStorage.getItem(dataPool[typePool])).tokenSelectedPool
    if (data['first'] && data['second']) {
        document.querySelector('.popup-hide').style.display = 'none';
        let contentPoolHideItems = document.querySelectorAll('.content-pool-hide');
        contentPoolHideItems.forEach(function (item) {
            item.classList.remove('content-pool-hide');
        });
        let tokenSelectDepositAmounts = document.querySelectorAll('.token-select-deposit-amount');
        tokenSelectDepositAmounts.forEach(function (item) {
            let type = item.getAttribute('data-type');
            let dataToken = data[type];
            item.innerHTML = `
                <img src=${dataToken['logo']} width="24" height="24"
                                    alt="circle">
                                <span class="token-symbol-deposit-amount">${dataToken['symbol']}</span>
            `
        });
        let tokenPers = document.querySelectorAll('.min-price-join-pool-item-text')
        tokenPers.forEach(function (item) {
            item.innerHTML = data['first']['symbol'] + ' per ' + data['second']['symbol'];
        });
    }
}

const activeTokenPool = () => {
    const dataSelectTokenPool = JSON.parse(localStorage.getItem(dataPool[typePool])).tokenSelectedPool;
    const typeTokenPool = localStorage.getItem('typeTokenPool');
    if (dataSelectTokenPool && typeTokenPool && dataSelectTokenPool[typeTokenPool]) {
        let tokenItems = document.querySelectorAll('.list-token-item');
        tokenItems.forEach(function (item) {
            const tokenName = item.getAttribute('data-token');
            if (dataSelectTokenPool[typeTokenPool]['name'] === tokenName) {
                item.classList.add('list-token-item-active');
            }
        });
    }
}


const renderSelectTokenPool = () => {
    let data = JSON.parse(localStorage.getItem(dataPool[typePool])).tokenSelectedPool
    if (!data) return;

    let selectItems = document.querySelectorAll('.content-left-select-token-item');

    selectItems.forEach(function (item) {
        let dataSelect = item.getAttribute('data-type');
        if (data[dataSelect]) {
            item.classList.add('content-left-select-token-item-have-token');
            item.innerHTML = `
            <div style="display: flex; align-items: center;gap:5px">
                <img src=${data[dataSelect].logo} alt="${data[dataSelect].name}" width="24" height="24">
            <span>${data[dataSelect].symbol}</span>
            </div>
            <img src="assets/images/icon/drop-down-icon.svg" alt="circle">
        `
        } else {
            item.classList.remove('swap-item-select-have-token');
            item.innerHTML = `
            <span>Select Token</span>
                        <img src="assets/images/icon/drop-down-icon.svg" alt="circle">
        `
        }
    });

    let BtnApprove = document.querySelector('.btn-approve')
    if (data['second']) {
        BtnApprove.classList.remove('btn-approve-active')
        BtnApprove.innerHTML = `Approve ${data['second'].symbol}`
    }
}

const changeFeeTier = (feeTier) => {
    let dataPoolJoin = localStorage.getItem(dataPool[typePool]);
    localStorage.setItem(dataPool[typePool], JSON.stringify({ ...JSON.parse(dataPoolJoin), feeTierValue: feeTier }));
    let contentPoolFeeTier = document.querySelector('.fee-tier-text');
    contentPoolFeeTier.innerHTML = `${feeTier}% fee tier`
}

const changeValue = (type, typeAction) => {
    let dataPoolJoin = JSON.parse(localStorage.getItem(dataPool[typePool]));
    let dataValueMinPrice = dataPoolJoin.valueMinPrice
    let dataValueByType = dataValueMinPrice[type]
    if (typeAction === 'add') {
        dataValueByType = Number(dataValueByType) + 0.5;
        localStorage.setItem(dataPool[typePool], JSON.stringify({
            ...dataPoolJoin,
            valueMinPrice: {
                ...dataValueMinPrice,
                [type]: dataValueByType
            }
        }))
    }
    if (typeAction === 'remove') {
        dataValueByType = Number(dataValueByType) - 0.5;
        if (dataValueByType < 0) {
            dataValueByType = 0
        }
        localStorage.setItem(dataPool[typePool], JSON.stringify({
            ...dataPoolJoin,
            valueMinPrice: {
                ...dataValueMinPrice,
                [type]: dataValueByType
            }
        }))
    }
    renderValueMinPrice()
}
const renderValueMinPrice = () => {
    let dataValueMinPrice = JSON.parse(localStorage.getItem(dataPool[typePool])).valueMinPrice
    let InputMinPrice = document.querySelectorAll('.input-min-join-pool-item');
    InputMinPrice.forEach(function (item) {
        let inputTypeMinprice = item.getAttribute('data-type-input');
        item.value = dataValueMinPrice[inputTypeMinprice]
    })
}

const addDataPool = () => {
    let dataPoolPreview = JSON.parse(localStorage.getItem(dataPool[typePool]))
    let listDataPool = JSON.parse(localStorage.getItem('dataPool')) || []
    listDataPool = [...listDataPool, dataPoolPreview]
    localStorage.setItem('dataPool', JSON.stringify(listDataPool))
    Modal.close()
    // Điều hướng sang pool.html
    window.location.href = 'pool.html'
}

const hideListDataPool = () => {
    let activePoolInfo = document.querySelector('.active-pool-info');
    let dataPool = JSON.parse(localStorage.getItem('dataPool')) || [];
    if (dataPool.length > 0) {
        if(document.querySelector('.content-active-info-title').textContent === 'Hide closed positions'){
            document.querySelector('.content-active-info-title').innerHTML = 'Show closed positions'
            activePoolInfo.innerHTML = ''
            activePoolInfo.style.height = 'max-content'
            activePoolInfo.style.justifyContent = 'start'
            dataPool?.slice(0,1).forEach(function (item) {
                let tokenSelectedPool = item?.tokenSelectedPool
                activePoolInfo.innerHTML += `
                    <div class="item-active-pool">
                        <div class="item-active-pool-info">
                            <div class="item-active-pool-info-token">
                                <div class="item-active-pool-info-img">
                                    <img src=${tokenSelectedPool['first']?.logo} width="21" height="21" alt="">
                                    <img src=${tokenSelectedPool['second']?.logo} width="21" height="21" alt="" style="margin-left: -11px;">
                                </div>
                                <span class="item-active-pool-info-text">${tokenSelectedPool['first']?.symbol}/${tokenSelectedPool['second']?.symbol}</span>
                                <div class="item-active-pool-fee-tier">${item?.feeTierValue}%</div>
                            </div>
                            <span class="item-active-pool-fee-tier">Min: <strong>${item?.valueMinPrice['first'] < 0.001 ? '< 0.001' : item?.valueMinPrice['first']} ${tokenSelectedPool['first']?.symbol} per ${tokenSelectedPool['second']?.symbol}</strong> - Max: <strong>${item?.valueMinPrice['second'] < 0.001 ? '< 0.001' : item?.valueMinPrice['second']} ${tokenSelectedPool['second']?.symbol} per ${tokenSelectedPool['first']?.symbol}</strong></span>
                        </div>
                        <div class="item-active-pool-status">
                            <span class="item-active-pool-status-text">In Range</span>
                            <div class="item-active-pool-status-info status-in-range"></div>
                        </div>
                    </div>
                `
            })
        }else{
            document.querySelector('.content-active-info-title').innerHTML = 'Hide closed positions'
            activePoolInfo.innerHTML = ''
            activePoolInfo.style.height = 'max-content'
            activePoolInfo.style.maxHeight = '266px'
            activePoolInfo.style.justifyContent = 'start'
            dataPool.forEach(function (item) {
                let tokenSelectedPool = item?.tokenSelectedPool
                activePoolInfo.innerHTML += `
                    <div class="item-active-pool">
                        <div class="item-active-pool-info">
                            <div class="item-active-pool-info-token">
                                <div class="item-active-pool-info-img">
                                    <img src=${tokenSelectedPool['first']?.logo} width="21" height="21" alt="">
                                    <img src=${tokenSelectedPool['second']?.logo} width="21" height="21" alt="" style="margin-left: -11px;">
                                </div>
                                <span class="item-active-pool-info-text">${tokenSelectedPool['first']?.symbol}/${tokenSelectedPool['second']?.symbol}</span>
                                <div class="item-active-pool-fee-tier">${item?.feeTierValue}%</div>
                            </div>
                            <span class="item-active-pool-fee-tier">Min: <strong>${item?.valueMinPrice['first'] < 0.001 ? '< 0.001' : item?.valueMinPrice['first']} ${tokenSelectedPool['first']?.symbol} per ${tokenSelectedPool['second']?.symbol}</strong> - Max: <strong>${item?.valueMinPrice['second'] < 0.001 ? '< 0.001' : item?.valueMinPrice['second']} ${tokenSelectedPool['second']?.symbol} per ${tokenSelectedPool['first']?.symbol}</strong></span>
                        </div>
                        <div class="item-active-pool-status">
                            <span class="item-active-pool-status-text">In Range</span>
                            <div class="item-active-pool-status-info status-in-range"></div>
                        </div>
                    </div>
                `
            })
        }
    } else {
        document.querySelector('.content-active-info-title').style.display = 'none'
        activePoolInfo && (activePoolInfo.innerHTML = '<span class="text-no-item-active">Your active liquidity positions will appear here.</span>')
        activePoolInfo && (activePoolInfo.style.height = '193px')
    }
}

const showBtnHide = () => {
    document.querySelector('.content-active-info-title').style.display = 'block'
}