window.addEventListener('click', handleClickOutside);
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;
    // Thiết lập dataMenuToken dựa trên trang
    if (currentPage.includes('index.html')) {
        localStorage.setItem('dataMenuToken', 'token');
        renderTableBasedOnMenuToken()
    } else if (currentPage.includes('token-detail')) {
        localStorage.setItem('dataMenuToken', 'transactionTokenInfo');
        renderTableBasedOnMenuToken()
    } else if (currentPage.includes('pool-detail')) {
        localStorage.setItem('dataMenuToken', 'poolTokenInfo');
        renderSelectToken()
        renderTableBasedOnMenuToken()
    }
    localStorage.setItem('network', '')
    localStorage.setItem('volume', '1d')
    // open popup network
    const networkContent = document.querySelector('.network-content');
    const networkMenu = document.querySelector('.network-content-menu');
    const volumeMenu = document.querySelector('.volume-menu');
    const volumeMenuContainer = document.querySelector('.volumn-menu-container');
    const searchContainer = document.querySelector('.search-token-container')
    const menuTokenItem = document.querySelectorAll('.menu-token-item')



    networkContent.addEventListener('click', function () {
        networkMenu.classList.toggle('network-content-menu-show');
    })
    volumeMenuContainer && volumeMenuContainer.addEventListener('click', function () {
        console.log('volumeMenuContainer');
        volumeMenu.classList.toggle('volume-menu-show');
        console.log(volumeMenu.classList);
    })

    // click menu network

    const networkItem = document.querySelectorAll('.network-content-menu-item')
    networkItem.forEach(function (item) {
        item.addEventListener('click', function () {
            let network = item.getAttribute('data-network')
            localStorage.setItem('network', network)
            renderNetworkContent(network)
        })
    })

    const renderNetworkContent = (network) => {
        let dataImage = {
            ethereum: '../assets/images/token/eth-logo.svg',
            optimism: '../assets/images/token/op-token.svg',
            polygon: '../assets/images/token/polygon-token.svg',
            zksync: '../assets/images/token/zksync-token.svg',
        }
        networkContent.querySelector('img').src = dataImage[network]
    }

    // click menu volume
    const volumeItem = document.querySelectorAll('.volume-menu-item')
    volumeItem.forEach(function (item) {
        item.addEventListener('click', function () {
            volumeItem.forEach(function (item) {
                item.classList.remove('network-content-menu-item-active')
            })
            item.classList.add('network-content-menu-item-active')
            let volume = item.getAttribute('data-volume')
            localStorage.setItem('volume', volume)
            renderVolumeContent(volume)
        })
    })

    const renderVolumeContent = (volume) => {
        let volumnValue = document.querySelector('.volumn-value')
        volumnValue.innerHTML = `${volume} volume`
    }

    // onCick input search
    searchContainer.addEventListener('click', function () {
        searchContainer.classList.add('show-input-search');
        document.querySelector('.input-search-token').focus();
    })

    // click menuItem token
    menuTokenItem.forEach(function (item) {
        item.addEventListener('click', function () {
            document.querySelector('.volumn-menu-container').style.display = 'flex'
            document.querySelector('.search-token-container').style.display = 'flex'
            document.querySelector('.input-search-token').placeholder = 'Search Token'
            menuTokenItem.forEach(function (item) {
                item.classList.remove('menu-token-item-active')
            })
            item.classList.add('menu-token-item-active')
            console.log('data', item.getAttribute('data-token'))
            localStorage.setItem('dataMenuToken', item.getAttribute('data-token'))
            if (item.getAttribute('data-token') == 'pool') {
                document.querySelector('.volumn-menu-container').style.display = 'none'
                document.querySelector('.input-search-token').placeholder = 'Search Pools'
            } else if (item.getAttribute('data-token') == 'transaction') {
                document.querySelector('.volumn-menu-container').style.display = 'none'
                document.querySelector('.search-token-container').style.display = 'none'
            }
        })
    })


    // Lấy phần tử menu

    // Lắng nghe sự kiện click trên document

    // drag to scroll table
    const tableContainer = document.querySelector('.table-container');

    let isDown = false;
    let startX;
    let scrollLeft;

    tableContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        tableContainer.classList.add('active');
        startX = e.pageX - tableContainer.offsetLeft;
        scrollLeft = tableContainer.scrollLeft;
    });

    tableContainer.addEventListener('mouseleave', () => {
        isDown = false;
        tableContainer.classList.remove('active');
    });

    tableContainer.addEventListener('mouseup', () => {
        isDown = false;
        tableContainer.classList.remove('active');
    });

    tableContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tableContainer.offsetLeft;
        const walk = (x - startX) * 2; // Số 2 là tốc độ cuộn, bạn có thể điều chỉnh
        tableContainer.scrollLeft = scrollLeft - walk;
    });
})

const handleClickShowSwap = () => {
    window.location.href = '../trade/index.html'
}

function handleClickOutside(event) {
    
    const networkContent = document.querySelector('.network-content');
    const networkMenu = document.querySelector('.network-content-menu');
    const volumeMenu = document.querySelector('.volume-menu');
    const volumeMenuContainer = document.querySelector('.volumn-menu-container');
    const searchContainer = document.querySelector('.search-token-container')

    if (!networkMenu.contains(event.target) && !networkContent.contains(event.target)) {
        networkMenu.classList.remove('network-content-menu-show');
    }

    if (!volumeMenuContainer.contains(event.target) && !volumeMenu.contains(event.target)) {
        volumeMenu.classList.remove('volume-menu-show');
    }

    if (!searchContainer.contains(event.target)) {
        searchContainer.classList.remove('show-input-search');
    }
}

// click table pool
