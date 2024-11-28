let data = [
    {
        name: 'Wrapped Bitcoin',
        logo: 'assets/images/swap/logo-token-dummy.svg',
        symbol: 'WBTC'
    },
    {
        name: 'Bitcoin',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'BTC'
    },
    {
        name: 'Ethereum',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'ETH'
    },
    {
        name: 'Toncoin',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'TON'
    },
    {
        name: 'WETH',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'WETH'
    },
    {
        name: 'Dogecoin',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'DOGE'
    },
    {
        name: 'Binance',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'BNB'
    },
    {
        name: 'Solana',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'SOL'
    },
    {
        name: 'Tether',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'USDT'
    },
    {
        name: 'Aave',
        logo: 'assets/images/swap/logo-token-default.svg',
        symbol: 'AAVE'
    },
]


document.addEventListener('modalInsertedswap', function () {
    let listTokenElement = document.querySelector('.list-token');
    let searchInput = document.querySelector('.search-input');

    // Hàm để render lại danh sách token
    function renderTokens(tokens) {
        // Xóa nội dung cũ
        listTokenElement.innerHTML = '';

        // Duyệt qua mảng tokens và render từng item
        tokens.forEach(token => {
            let tokenItem = document.createElement('div');
            tokenItem.classList.add('list-token-item');

            tokenItem.setAttribute('data-token', token.name);
            tokenItem.setAttribute('data-logo', token.logo);
            tokenItem.setAttribute('data-symbol', token.symbol);

            let tokenContent = document.createElement('div');
            tokenContent.classList.add('list-token-item-content');

            let img = document.createElement('img');
            img.src = token.logo;
            img.alt = token.name;

            let tokenText = document.createElement('div');
            tokenText.classList.add('list-token-item-text');

            let nameSpan = document.createElement('span');
            nameSpan.classList.add('list-token-item-name');
            nameSpan.textContent = token.name;

            let symbolSpan = document.createElement('span');
            symbolSpan.classList.add('list-token-item-symbol');
            symbolSpan.textContent = token.symbol;

            tokenText.appendChild(nameSpan);
            tokenText.appendChild(symbolSpan);
            tokenContent.appendChild(img);
            tokenContent.appendChild(tokenText);
            tokenItem.appendChild(tokenContent);

            listTokenElement.appendChild(tokenItem);
        });
    }

    // Render toàn bộ token khi load lần đầu
    renderTokens(data);

    // Lắng nghe sự kiện input từ ô tìm kiếm
    searchInput.addEventListener('input', function () {
        let searchValue = searchInput.value.toLowerCase();

        // Lọc token theo tên dựa trên input
        let filteredTokens = data.filter(token => token.name.toLowerCase().includes(searchValue));

        // Render lại danh sách token sau khi lọc
        renderTokens(filteredTokens);
    });
});

document.addEventListener('modalInsertedpool', function () {
    let listTokenElement = document.querySelector('.list-token');
    let searchInput = document.querySelector('.search-input');

    // Hàm để render lại danh sách token
    function renderTokens(tokens) {
        // Xóa nội dung cũ
        listTokenElement.innerHTML = '';

        // Duyệt qua mảng tokens và render từng item
        tokens.forEach(token => {
            let tokenItem = document.createElement('div');
            tokenItem.classList.add('list-token-item');

            tokenItem.setAttribute('data-token', token.name);
            tokenItem.setAttribute('data-logo', token.logo);
            tokenItem.setAttribute('data-symbol', token.symbol);

            let tokenContent = document.createElement('div');
            tokenContent.classList.add('list-token-item-content');

            let img = document.createElement('img');
            img.src = token.logo;
            img.alt = token.name;

            let tokenText = document.createElement('div');
            tokenText.classList.add('list-token-item-text');

            let nameSpan = document.createElement('span');
            nameSpan.classList.add('list-token-item-name');
            nameSpan.textContent = token.name;

            let symbolSpan = document.createElement('span');
            symbolSpan.classList.add('list-token-item-symbol');
            symbolSpan.textContent = token.symbol;

            tokenText.appendChild(nameSpan);
            tokenText.appendChild(symbolSpan);
            tokenContent.appendChild(img);
            tokenContent.appendChild(tokenText);
            tokenItem.appendChild(tokenContent);

            listTokenElement.appendChild(tokenItem);
        });

        const event = new CustomEvent(`modalInsertedListPool`);
        document.dispatchEvent(event);
    }

    // Render toàn bộ token khi load lần đầu
    renderTokens(data);

    // Lắng nghe sự kiện input từ ô tìm kiếm
    searchInput.addEventListener('input', function () {
        let searchValue = searchInput.value.toLowerCase();

        // Lọc token theo tên dựa trên input
        let filteredTokens = data.filter(token => token.name.toLowerCase().includes(searchValue));

        // Render lại danh sách token sau khi lọc
        renderTokens(filteredTokens);
    });
});