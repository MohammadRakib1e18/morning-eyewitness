let loadCategories = () => {
    const url = "https://openapi.programming-hero.com/api/news/categories";
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayCategories(data.data.news_category));
};

let displayCategories = (newCatetories) => {
    let newsCategoriesContainer = document.getElementById("news-categories");
    newCatetories.forEach((news) => {
        let span = document.createElement("span");

        span.className = "news-category";
        span.innerText = news.category_name;
        span.setAttribute("category_id", news.category_id);
        span.onclick = displayButtonClicked;

        newsCategoriesContainer.appendChild(span);
    });
};

let displayButtonClicked = (event) => {
    let button = event.target;
    let id = button.getAttribute("category_id");
    let totalButtons = document.getElementsByClassName("news-category");

    //btn toggle
    for (let btn of totalButtons) {
        btn.removeAttribute("id");
    }
    button.setAttribute("id", "active");

    document.getElementById("selected-category").innerText =
        event.target.innerText;

    // fetched category-based data
    const url = `https://openapi.programming-hero.com/api/news/category/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => displaySelectedCategoryNews(data.data));
};

let displaySelectedCategoryNews = (newsPosts) => {
    let newsPostCounter = newsPosts.length;
    document.getElementById("result-counter").innerText =
        "( " + newsPostCounter + " )";
    let selectedNewsContainer = document.getElementById('news-container');
    selectedNewsContainer.innerHTML="";

    newsPosts.forEach(post => {
        let article = document.createElement('article');
        article.className='d-flex mx-3 bg-info bg-opacity-10 p-3';

        article.innerHTML = `
            <img src="${post.thumbnail_url}" class="w-25 img-fluid"  alt="">
            <section class="ms-2 w-75">
                <h2>${post.title}</h2>
                <p>${post.details}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="author w-25 d-flex gap-2">
                        <img src="${post.author.img}" class="w-25" alt="">
                        <div class="d-flex flex-column">
                            <span>${post.author.name}</span>
                            <span>${post.author.published_date}</span>
                        </div>
                    </div>
                    <div>${post.total_view}</div>
                    <div>${post.rating.badge}</div>
                </div>
            </section>
        `
        selectedNewsContainer.appendChild(article);
    })
};

loadCategories();
