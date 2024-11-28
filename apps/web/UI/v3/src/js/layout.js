const togglePopupMenu = () => {
    let popupMenu = document.querySelector('.popup-menu-mobile')
    let btnMenu = document.querySelector('.button-menu')
    if (popupMenu) {
        popupMenu.classList.toggle('popup-menu-mobile-show')
    }
    if (btnMenu.classList.contains('button-menu-active')) {
        btnMenu.classList.remove('button-menu-active')
    } else {
        btnMenu.classList.add('button-menu-active')
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const documentModal = `<section id="modal1" class="modal"></section>`
    document.body.insertAdjacentHTML('beforeend', documentModal)

    let popupMenu = document.querySelector('.popup-menu-mobile')
    let btnMenu = document.querySelector('.button-menu')
    function handleClickOutsideMenu(event) {
        if (!popupMenu.contains(event.target) && !btnMenu.contains(event.target)) {
            btnMenu.classList.remove('button-menu-active')
            popupMenu.classList.remove('popup-menu-mobile-show')
        }
    }

    // Lắng nghe sự kiện click trên document
    document.addEventListener('click', handleClickOutsideMenu);
})

// show btn return to top

// Lắng nghe sự kiện cuộn
window.onscroll = function() {
    const button = document.querySelector('.btn-return-to-top');
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        button.classList.add('show-btn-return-to-top');
    } else {
        button.classList.remove('show-btn-return-to-top');
    }
};

const returnToTop = () => {
    document.getElementById('tableWrapper').scrollTo({top: 0, behavior: 'smooth'})
    window.scrollTo({top: 0, behavior: 'smooth'})
}