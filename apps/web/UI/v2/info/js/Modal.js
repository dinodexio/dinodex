(function () {

    var SELECTOR_MODAL = '.modal'

    // Hàm đóng modal
    function closeModal() {
        const modalElement = document.querySelector(SELECTOR_MODAL);
        if (modalElement) {
            modalElement.style.opacity = 0;
            modalElement.style.zIndex = -1;
            setTimeout(function () {
                modalElement.style.display = 'none';
            }, 500)
        }
    }

    function loadModal(modalFile) {
        document.querySelector(SELECTOR_MODAL).classList.add = modalFile;
        const LIST_DEFAULT_MODAL = {
            'modalSelectToken': `<div class="modal-select-token">
                <div class="header-content-modal">
                    <span class="header-text">
                        Select a token
                    </span>
                <div class="close" onclick="Modal.close()">
                    <img src="../assets/images/swap/close-icon-modal.svg" alt="close">
                </div>
                </div>
                <div class="search-container">
                    <input class="search-input" type="text" placeholder="Search tokens">
                </div>
                <div class="list-token-content">
                    <span class="list-token-head">Top Tokens</span>
                    <div class="line-list-token"></div>
                    <div class="list-token">
                        <div class="loading-list-token">
                            <div class="loader"></div>
                        </div>
                    </div>
                </div>
            </div>`,
            'modalPreviewPool': `<div class="modal-preview-pool-container">
                <div class="header-content-modal-preview-pool">
                    <span class="header-preview-pool-text">
                        Add Liquidity
                    </span>
                    <div class="close btn-close-modal-preview-pool" onclick="Modal.close()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M9.01502 10.7131L15.9288 17.6269C16.1593 17.8495 16.468 17.9727 16.7885 17.9699C17.1089 17.9671 17.4154 17.8386 17.642 17.612C17.8686 17.3854 17.9972 17.0789 18 16.7584C18.0027 16.438 17.8796 16.1293 17.6569 15.8988L10.7432 8.98498L17.6569 2.07121C17.8796 1.84071 18.0027 1.53199 18 1.21154C17.9972 0.891095 17.8686 0.584562 17.642 0.357963C17.4154 0.131365 17.1089 0.0028308 16.7885 4.62009e-05C16.468 -0.0027384 16.1593 0.120449 15.9288 0.343075L9.01502 7.25685L2.10125 0.343075C1.86971 0.125952 1.56278 0.00742745 1.24541 0.012581C0.928031 0.0177346 0.625112 0.146162 0.400744 0.370689C0.176376 0.595215 0.0481627 0.898225 0.0432336 1.2156C0.0383046 1.53298 0.157046 1.83983 0.374333 2.07121L7.28688 8.98498L0.373111 15.8988C0.256382 16.0115 0.163276 16.1464 0.0992235 16.2955C0.0351712 16.4446 0.0014563 16.6049 4.61452e-05 16.7672C-0.00136401 16.9295 0.0295585 17.0904 0.0910099 17.2406C0.152461 17.3908 0.243211 17.5273 0.357963 17.642C0.472715 17.7568 0.609172 17.8475 0.759371 17.909C0.90957 17.9704 1.0705 18.0014 1.23278 18C1.39506 17.9985 1.55543 17.9648 1.70454 17.9008C1.85365 17.8367 1.98851 17.7436 2.10125 17.6269L9.01502 10.7131Z"
                                fill="black" />
                        </svg>
                    </div>
                </div>
                <div class="content-modal-preview-pool">
                    <div class="loading-preview-pool">
                            <div class="loader"></div>
                    </div>
                </div>
                <div class="button-swap btn-modal-preview-pool" onclick="addDataPool()"><span>Add</span></div>
            </div>`,
        }

        const modalElement = document.querySelector(SELECTOR_MODAL);

        modalElement.innerHTML = LIST_DEFAULT_MODAL[modalFile];

        modalElement.style.display = 'block';
        setTimeout(function () {
            modalElement.style.opacity = 1;
            modalElement.style.zIndex = 100;
        }, 100)

        window.onclick = function (event) {
            if (event.target == document.querySelector(SELECTOR_MODAL)) {
                document.querySelector(SELECTOR_MODAL).style.opacity = 0;
                document.querySelector(SELECTOR_MODAL).style.zIndex = -1;
                setTimeout(function () {
                    document.querySelector(SELECTOR_MODAL).style.display = 'none';
                }, 500)
            }
        };

        // return fetch('modal/' + modalFile + '.html')
        //     .then(function (response) {
        //         return response.text();
        //     })
        //     .then(function (data) {
        //         // check and remove modal
        //         var existingModal = document.querySelector(SELECTOR_MODAL);
        //         if (existingModal) {
        //             existingModal.remove();
        //         }

        //         // insert modal
        //         document.body.insertAdjacentHTML('beforeend', data);

        //         const modalElement = document.querySelector(SELECTOR_MODAL);
        //         var closeButton = modalElement.querySelector('.close');

        //         modalElement.style.display = 'block';
        //         setTimeout(function () {
        //             modalElement.style.opacity = 1;
        //             modalElement.style.zIndex = 100;
        //         }, 100)

        //         closeButton.onclick = function () {
        //             modalElement.style.opacity = 0;
        //             modalElement.style.zIndex = -1;
        //             setTimeout(function () {
        //                 modalElement.style.display = 'none';
        //             }, 500)
        //         };

        //         const event = new CustomEvent(`modalInserted${type}`);
        //         document.dispatchEvent(event);

        //         window.onclick = function (event) {
        //             if (event.target == modalElement) {
        //                 modalElement.style.opacity = 0;
        //                 setTimeout(function () {
        //                     modalElement.style.display = 'none';
        //                 }, 500)
        //             }
        //         };
        //     })
        //     .catch(function (error) { console.error('Error loading modal:', error) });
    }

    async function renderModal(modalFile, type) {
        await ListRenderModal[modalFile].render()
        const event = new CustomEvent(`modalInserted${type}`);
        document.dispatchEvent(event);
    }

    window.Modal = {
        open: async function (modalFile, type) {
            await loadModal(modalFile);
            await renderModal(modalFile, type);
        },
        close: closeModal,
    }
})()