var favouritesBtns = document.querySelectorAll('.favourites-wrapper');
    favourites = document.querySelector('.favourites');

favouritesBtns.forEach(favouritesBtn => {
    favouritesBtn.addEventListener('click', () => {
        favourites.classList.toggle('activeFav');
    });
});