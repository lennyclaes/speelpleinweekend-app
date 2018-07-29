document.addEventListener('DOMContentLoaded', () => {
    let menuBtn = document.querySelector('.menu-btn');

    menuBtn.addEventListener('click', () => {
        let drpcnt = document.querySelector('.dropdown-content');

        drpcnt.classList.toggle('show');
    })
});