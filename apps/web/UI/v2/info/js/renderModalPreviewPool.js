document.addEventListener('modalInsertedPreviewPool', function () {
    let previewPool = localStorage.getItem('previewPool')
    let dataPool = previewPool === 'poolJoin' ? JSON.parse(localStorage.getItem('dataPoolJoin')) : JSON.parse(localStorage.getItem('dataPoolCreate'))
    let tokenSelectedPool = dataPool.tokenSelectedPool
    let valueMinPrice = dataPool.valueMinPrice
    let feeTierValue = dataPool.feeTierValue
    let contentModalPreviewPool = document.querySelector('.content-modal-preview-pool')
    contentModalPreviewPool.innerHTML = `<div class="content-modal-preview-header"><div class="content-modal-preview-header-token">
                    <div class="content-modal-preview-header-token" style="gap: 0px;">
                        <img src=${tokenSelectedPool['first']?.logo} width="26" height="26" alt="">
                        <img src=${tokenSelectedPool['second']?.logo} width="26" height="26" alt=""
                            style="margin-left: -11px;">
                    </div>
                    <span class="preview-header-text">${tokenSelectedPool['first']?.symbol}/${tokenSelectedPool['second']?.symbol}</span>
                </div>
                <div class="content-modal-preview-header-status">
                    <span class="preview-header-text">In Range</span>
                    <div class="preview-header-status-info status-in-range"></div>
                </div>
            </div>
            <div class="content-preview-pool-token">
                <div class="preview-pool-token-item">
                    <div class="preview-pool-token-item-info">
                        <img src=${tokenSelectedPool['first']?.logo} width="26" height="26" alt="">
                        <span class="preview-header-text">${tokenSelectedPool['first']?.symbol}</span>
                    </div>
                    <span class="preview-header-text">${tokenSelectedPool['first']?.deposit_amount || 1}</span>
                </div>
                <div class="preview-pool-token-item">
                    <div class="preview-pool-token-item-info">
                        <img src=${tokenSelectedPool['second']?.logo} width="26" height="26" alt="">
                        <span class="preview-header-text">${tokenSelectedPool['second']?.symbol}</span>
                    </div>
                    <span class="preview-header-text">${tokenSelectedPool['second']?.deposit_amount || 1}</span>
                </div>
                <div class="preview-pool-token-item">
                    <span class="preview-header-fee-tier-text">Fee Tier</span>
                    <span class="preview-header-fee-tier-text">${feeTierValue}%</span>
                </div>
            </div>
            <div class="selected-range-content">
                <span class="selected-range-content-header">
                    Selected Range
                </span>
                <div class="switch-select-range">
                    <div class="switch-select-range-item switch-select-range-item-active">${tokenSelectedPool['first']?.symbol}</div>
                    <div class="switch-select-range-item">${tokenSelectedPool['second']?.symbol}</div>
                </div>
            </div>
            <div class="content-min-price">
                <div class="content-min-price-item">
                    <span class="content-min-price-item-title">Min Price</span>
                    <span class="header-preview-pool-text">${Number(valueMinPrice['first']) > 0 && Number(valueMinPrice['first']) < 0.001 ? `<span>${`<`}</span>0.001` : valueMinPrice['first']}</span>
                    <span class="content-min-price-item-title">${tokenSelectedPool['first']?.symbol} per ${tokenSelectedPool['second']?.symbol}</span>
                    <span class="content-min-price-item-desc">Your position will be 100% composed of ETH at this
                        price</span>
                </div>
                <div class="content-min-price-item">
                    <span class="content-min-price-item-title">Min Price</span>
                    <span class="header-preview-pool-text">${Number(valueMinPrice['second']) > 0 && Number(valueMinPrice['second']) < 0.001 ? `<span>${`<`}</span>0.001` : valueMinPrice['second']}</span>
                    <span class="content-min-price-item-title">${tokenSelectedPool['first']?.symbol} per ${tokenSelectedPool['second']?.symbol}</span>
                    <span class="content-min-price-item-desc">Your position will be 100% composed of ETH at this
                        price</span>
                </div>
            </div>
            <div class="content-min-price-item" style="width: 100%;">
                <span class="content-min-price-item-title">Current Price</span>
                <span class="header-preview-pool-text">1.002</span>
                <span class="content-min-price-item-title">${tokenSelectedPool['first']?.symbol} per ${tokenSelectedPool['second']?.symbol}</span>
            </div>`
})