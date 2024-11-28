document.addEventListener('DOMContentLoaded', function () {
    let dataPool = JSON.parse(localStorage.getItem('dataPool')) || [];
    let activePoolInfo = document.querySelector('.active-pool-info');
    let activePoolContainer = document.querySelector('.active-pool-container');
    if (dataPool.length > 0) {
        if (dataPool.length === 1) {
            activePoolInfo.style.height = 'max-content'
            activePoolInfo.style.justifyContent = 'start'
        } else {
            activePoolInfo.style.height = '266px'
            activePoolInfo.style.justifyContent = 'start'
            activePoolInfo.style.overflowY = 'scroll'
        }
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
    } else {
        document.querySelector('.content-active-info-title').style.display = 'none'
        activePoolInfo && (activePoolInfo.innerHTML = '<span class="text-no-item-active">Your active liquidity positions will appear here.</span>')
        activePoolInfo && (activePoolInfo.style.height = '193px')
    }
})