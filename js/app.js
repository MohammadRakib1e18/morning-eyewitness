let loadCategories = () =>{
    const url="https://openapi.programming-hero.com/api/news/categories";
    fetch(url)
    .then(res => res.json())
    .then(data => displayCategories(data.data.news_category));
}

let displayCategories = (newCatetories) =>{
    let newsCategoriesContainer = document.getElementById('news-categories');
    console.log(newsCategoriesContainer);
    newCatetories.forEach(news => {
        // console.log(news.category_name);
        let span = document.createElement('span');
        span.className='news-category';
        span.innerText = news.category_name;
        console.log(span);
        newsCategoriesContainer.appendChild(span);
    })
}

loadCategories();