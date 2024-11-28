document.addEventListener('DOMContentLoaded', function () {
    localStorage.setItem('time-price', '1d')
    // click menu time price
    let menuTimePrice = document.querySelectorAll('.token-layout-menu-time-price-item')
    menuTimePrice.forEach(function (item) {
        item.addEventListener('click', function () {
            menuTimePrice.forEach(function (item) {
                item.classList.remove('token-layout-menu-time-price-item-active')
            })
            item.classList.add('token-layout-menu-time-price-item-active')
            localStorage.setItem('time-price', item.getAttribute('data-time'))
        })
    })

    // click menu change table 
    const menuTokenItem = document.querySelectorAll('.menu-token-item')
    menuTokenItem.forEach(function (item) {
        item.addEventListener('click', function () {
            menuTokenItem.forEach(function (item) {
                item.classList.remove('menu-token-item-active')
            })
            item.classList.add('menu-token-item-active')
            localStorage.setItem('dataMenuToken', item.getAttribute('data-token'))
            renderTableBasedOnMenuToken();
        })
    })

    // copy address
    const copyBtnItems = document.querySelectorAll('.copy-btn')
    copyBtnItems.forEach(function (copyBtn) {
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(copyBtn.getAttribute('data-address'))
            alert('Copyed')
        })
    })
})

const showPopupSwap = () => {
    let SwapPopup = document.querySelector('.swap-token-container')
    SwapPopup.classList.add('show-swap-layout')
    document.querySelector('.btn-swap-mobile').style.display = 'none'
}

const hideSwapPopup = () => {
    document.querySelector('.btn-swap-mobile').style.display = 'block'
    let SwapPopup = document.querySelector('.swap-token-container')
    SwapPopup.classList.remove('show-swap-layout')
}