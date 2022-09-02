let loadCategories = () => {
    const url = "https://openapi.programming-hero.com/api/news/categories";
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayCategories(data.data.news_category));
};

let displayCategories = (newsCategories) => {
    let newsCategoriesContainer = document.getElementById("news-categories");
    newsCategories.forEach((news) => {
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

    newsPosts = getPopularPosts([...newsPosts]);

    newsPosts.forEach(post => {
        let article = document.createElement('article');
        article.className='d-flex mx-3 single-post mb-4 px-4 py-4';

        article.innerHTML = `
            <div class="news-thumbnail">
                <img  src="${post.thumbnail_url?post.thumbnail_url:image_url}"  alt="">
            </div>
            <section class=" ms-3 d-flex flex-column justify-content-between">
                <div>
                    <h2 class="fw-bolder">${post.title}</h2>
                    <p class="text-muted">${post.details}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center  text-muted">
                    <div class="author d-flex align-items-center gap-2">
                        <img src="${post.author.img}" class="" alt="">
                        <div class="d-flex flex-column text-muted fs-6">
                            <span>${post.author.name?post.author.name:"Anonymous"}</span>
                            <span><i class="fas fa-calendar-alt me-1"></i>${post.author.published_date?post.author.published_date:"Coming soon!"}</span>
                        </div>
                    </div>
                    <div class="fw-bolder fs-6"><i class="fa fa-regular fa-eye me-2"></i>${post.total_view?post.total_view:5}M</div>
                    <div>${post.rating?.badge}</div>
                </div>
            </section>
        `
        selectedNewsContainer.appendChild(article);
    })
};

// sort the posts by Total Views
let getPopularPosts = (posts) => {
    return posts.sort(function (a, b) {
        return b.total_view - a.total_view;
    });
};

loadCategories();
