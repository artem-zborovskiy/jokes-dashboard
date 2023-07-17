var form = document.querySelector('#form');
    categories = document.querySelector('input[value = categories]');
    inputTypes = document.querySelectorAll('input[name = type]');
    categoriesBlock = document.querySelector('.categoriesBlock');
    jokesBlock = document.querySelector('.jokesList');
    inputSearch = document.querySelector('.search');
    favourites = document.querySelector('.favourites');

form.addEventListener('submit', formSubmit);

inputTypes.forEach(input => {
    input.addEventListener('change', e => {
        if(e.target.value !== 'categories') {
            categoriesBlock.classList.add('hide');
        } else {
            categoriesBlock.classList.remove('hide');
        }
        if(e.target.value !== 'search') {
            inputSearch.classList.add('hide');
        } else {
            inputSearch.classList.remove('hide');
        }
    });
});

function style() {
    var selectedBlocks = document.querySelectorAll('.active');
        selectedBlock = document.querySelector('input[name=category]:checked').closest('label');

    if(selectedBlocks.length >= 1) {
        selectedBlocks.forEach(item => {
            item.classList.remove('active');
        });
    }

    selectedBlock.classList.add('active');
}

categories.addEventListener('change', async () => {
    var categories = await getJoke('categories');
    Joke.renderCategories(categories);
    var ALLcategories = document.querySelectorAll('.category');
    ALLcategories.forEach(item => {
        item.addEventListener('change', style);
    });
});

async function formSubmit(e) {
    var validForm = true;
    e.preventDefault();
    jokesBlock.innerHTML = '';

    var typeElement = document.querySelector(`input[name = type]:checked`);

    if(typeElement !== null) {
        type = typeElement.value;

        if(type === `search`) {
            var userSearch = document.querySelector(`#userSearch`);
                searchValue = userSearch.value;
    
            searchValue = searchValue === `` ? invalid(searchValue, userSearch) : valid(searchValue, userSearch);
            type = `search?query=${searchValue}`;
        } else if(type === `categories`) {
            var selectedCategory = document.querySelector('input[name = category]:checked');
                selectedCategoryValue = selectedCategory.value;
            
            type = `random?category=${selectedCategoryValue}`;
        }

        var data = await getJoke(type);

        if(validForm = true) {
            if(type.indexOf('search') > -1) {
                data.result.forEach(joke => {
                    Joke.createJoke(joke);
                });
            } else {
                Joke.createJoke(data);
            }
        }
    }   
}

function invalid(searchValue, userSearch) {
    validForm = false;
    do {
        userSearch.classList.add('invalid');
    } while(searchValue = searchValue === ``);
}

function valid(searchValue, userSearch) {
    validForm = true;
    userSearch.classList.remove('invalid');
    return searchValue.trim();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}

async function getJoke(type) {
    var data = await fetch(`https://api.chucknorris.io/jokes/${type}`);
        json = await data.json();

    return json;
}

class Joke {
    static createJoke(data) {
        var joke = new Joke();

        for(let key in data) {
            joke[key] = data[key];
        }

        joke.renderJoke();
    }

    static renderCategories(data) {
        categoriesBlock.innerHTML = '';

        data.forEach((category, index) => {
            var label = document.createElement('label');
            var input = document.createElement('input');
    
            label.classList.add('category');
    
            input.type = 'radio';
            input.value = category;
            input.name = 'category';
            input.classList.add('hide');
            input.checked = index === 0 ? true : false;
    
            label.innerHTML = category;
            label.prepend(input);
    
            categoriesBlock.append(label);
        });

        var firstDiv = document.querySelector('.category:first-of-type');
        firstDiv.classList.add('active');
    }

    renderJoke() {
        var singleJoke = document.createElement('div');
        singleJoke.classList.add('singleJoke');

        var id = `<p class="link">ID: <a href="#">${this.id}<img src="img/link.svg"></a></p>`;
        let icon = `<img src="./img/pfp.png" class="icon" width="22px">`;
        var value = `<p class="joke_value">${this.value}</p>`;
        var time = `<p class="data">Last update: <span>${formatDate(this.updated_at)}</span></p>`;
        var categories = ``;

        singleJoke.setAttribute(`data-id`, `block_${this.id}`);

        singleJoke.innerHTML += `<div class="joke_block">${icon}<div class="full_size">${id}${value}<div class="joke_footer">${time}</div></div></div>`;
        
        jokesBlock.append(singleJoke); 

        if(this.categories.length !== 0) {
            categories = `<div class="joke_category">${this.categories}</div>`;
            document.querySelector('.joke_footer').innerHTML += categories;
        }

        var heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.4134 1.66367C17.3781 0.590857 15.9575 0 14.413 0C13.2585 0 12.2012 0.348712 11.2704 1.03637C10.8008 1.38348 10.3752 1.80814 10 2.3038C9.62494 1.80829 9.19922 1.38348 8.7294 1.03637C7.79877 0.348712 6.74149 0 5.58701 0C4.04251 0 2.62177 0.590857 1.58646 1.66367C0.563507 2.72395 0 4.17244 0 5.74252C0 7.35852 0.630341 8.83778 1.98364 10.3979C3.19427 11.7935 4.93423 13.2102 6.94916 14.8507C7.63718 15.411 8.41705 16.046 9.22684 16.7224C9.44077 16.9015 9.71527 17 10 17C10.2846 17 10.5592 16.9015 10.7729 16.7227C11.5826 16.0461 12.363 15.4108 13.0513 14.8503C15.0659 13.2101 16.8059 11.7935 18.0165 10.3978C19.3698 8.83778 20 7.35852 20 5.74238C20 4.17244 19.4365 2.72395 18.4134 1.66367Z" fill="#FF6767"/></svg>';
        heart.addEventListener('click', ()=>{
            this.addFavourite();
        });
        singleJoke.prepend(heart);
    }

    addFavourite() {
        var currentBlock = document.querySelector(`div[data-id = block_${this.id}]`);
        if(favourites.querySelector(`div[data-id = copied_${this.id}]`) == null) {
            currentBlock.classList.add('favouriteJoke');

            var copiedBlock = currentBlock.cloneNode(true);
            copiedBlock.classList.add('favouriteJoke');
            copiedBlock.setAttribute(`data-id`, `copied_${this.id}`);
            favourites.append(copiedBlock);

            let heart = copiedBlock.querySelector('.heart');
            heart.addEventListener('click', () => {
                this.removeFromFavourite();
            });
        }
    }

    removeFromFavourite() {
        var currentFavourite = document.querySelector(`div[data-id = copied_${this.id}]`);
        var currentJoke = document.querySelector(`div[data-id = block_${this.id}]`)
        currentFavourite.remove();
        currentJoke.classList.remove('favouriteJoke');
    }
}