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

        span.className = "news-category mb-1";
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

let addToModal = (data) => {
    console.log(data);
    let modalTitle = document.getElementById('modal-title');
    modalTitle.innerText = data.title;

    let modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <img class="w-100 border border-4 border-secondary" src="${data.thumbnail_url ? data.thumbnail_url : data.image_url}" alt="" />
        <div class="bg-secondary text-light border-secondary p-2">
            ${data.details}
        </div> 
    `

};

let bindEventListener = () => {
    let readMoreButtons = document.getElementsByClassName("read-more");

    for (let readMore of readMoreButtons) {
        readMore.setAttribute("data-bs-toggle", "modal");
        readMore.setAttribute("data-bs-target", "#exampleModal");

        readMore.addEventListener("click", function (event) {
            event.preventDefault();

            let button = event.target;
            let id=button.getAttribute('id');
            let url = `https://openapi.programming-hero.com/api/news/${id}`;
            fetch(url)
            .then(res => res.json())
            .then(data => addToModal(data.data[0]));
        });
    }
};

let displaySelectedCategoryNews = (newsPosts) => {
    let newsPostCounter = newsPosts.length;
    document.getElementById("result-counter").innerText =
        "( " + newsPostCounter + " )";
    let selectedNewsContainer = document.getElementById("news-container");
    selectedNewsContainer.innerHTML = "";

    newsPosts = getPopularPosts([...newsPosts]);

    newsPosts.forEach((post) => {
        let article = document.createElement("article");
        article.className = "d-flex mx-3 single-post mb-4 px-4 py-4";

        let text = post.details.slice(0, 500);
        if (post.details.length > 500) {
            text += " ...";
        }

        let ratingText = "";
        let gotRating = post.rating.number;
        if (!post.rating.number) gotRating = 3.5;

        let full = Math.floor(gotRating);
        let half = Math.ceil(gotRating) - full;

        let empty = 5 - full - half;
        for (let i = 0; i < full; i++) {
            ratingText += '<i class="fa fa-solid fa-star ms-2"></i>';
        }
        for (let i = 0; i < half; i++) {
            ratingText += '<i class="fa fa-solid fa-star-half ms-2"></i>';
        }
        for (let i = 0; i < empty; i++) {
            ratingText += '<i class="fa-regular fa-star ms-2"></i>';
        }

        article.innerHTML = `
            <div class="news-thumbnail">
                <img  src="${
                    post.thumbnail_url ? post.thumbnail_url : post.image_url
                }"  alt="">
            </div>
            <section class=" ms-4 d-flex flex-column justify-content-between">
                <div>
                    <h2 class="fw-bolder">${post.title}</h2>
                    <p class="text-muted">${text}</p>
                    <a class="text-decoration-none read-more">
                        <span id=${post._id} class="">Read More </span>
                        <i class="fas fa-angle-right"></i>
                    </a>
                </div>
                <div class="d-flex justify-content-between align-items-center  text-muted">
                    <div class="author d-flex align-items-center gap-2 mt-3">
                        <img src="${post.author.img}" class="" alt="">
                        <div class="d-flex flex-column text-muted fs-6">
                            <span><i class="fa fa-solid fa-user me-1"></i>${
                                post.author.name
                                    ? post.author.name
                                    : "Anonymous"
                            }</span>
                            <span><small><i class="fas fa-calendar-alt me-1"></i>${
                                post.author.published_date
                                    ? post.author.published_date
                                    : "Coming soon!"
                            }</small></span>
                        </div>
                    </div>
                    <div class="fw-bolder fs-6"><i class="fa fa-regular fa-eye me-2"></i>${
                        post.total_view ? post.total_view : 5
                    }M</div>
                    <div class="text-warning">${ratingText}</div>
                </div>
            </section>
        `;
        selectedNewsContainer.appendChild(article);
    });

    bindEventListener();
};

// sort the posts by Total Views
let getPopularPosts = (posts) => {
    return posts.sort(function (a, b) {
        return b.total_view - a.total_view;
    });
};

loadCategories();
