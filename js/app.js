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

let displaySelectedCategoryNews = (data) => {
    let totalNews = data.length;
    document.getElementById("result-counter").innerText =
        "( " + totalNews + " )";
};

loadCategories();
