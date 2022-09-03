// Load categories

let loadCategories = () => {
    const url = "https://openapi.programming-hero.com/api/news/categories";

    fetch(url)
        .then((res) => res.json())
        .then((data) => displayCategories(data.data.news_category))
        .catch(err => {
            console.error("There was an error: ", err); // error checking.
        })

};
/*------------------------------------------------------*/

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
    toggleSpinner(true);
    document.getElementsByClassName('news-category')[0].setAttribute('id', 'active');
    document.getElementById("selected-category").innerText = document.getElementsByClassName('news-category')[0].innerText;
    fetchCategoryBasedData("01");
};
/*------------------------------------------------------*/

let fetchCategoryBasedData = (id) => {
    toggleSpinner(false);

    // fetched category-based data
    const url = `https://openapi.programming-hero.com/api/news/category/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => displaySelectedCategoryNews(data.data))
        .catch(err => {
            console.error("There was an error: ", err); //error checking
        })
}

/*------------------------------------------------------*/
// show active button 

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

    fetchCategoryBasedData(id);
    
};

/*------------------------------------------------------*/
// here is the code to add modal 
let addToModal = (data) => {
    toggleSpinner(true);
    let modalTitle = document.getElementById("modal-title");
    let picked="";
    let trending="";
    if(data.others_info.is_today_pick){
        picked="<i class='text-success fa fa-regular fa-check'></i>";
    }
    else{
        picked="<span class='ms-2 text-danger'>X</span>";
    }
    if(data.others_info.is_trending){
        trending="<i class='text-success fa fa-regular fa-check'></i>";
    }
    else{
        trending="<span class='ms-2 text-danger'>X</span>";
    }
    modalTitle.innerHTML=`
        <h3 class="text-info modal-heading"><span class="text-muted text-decoration-underline">Head line:</span> ${data.title}</h3>
        <div class="d-flex justify-content-between align-items-center">
            <div class="w-75 author d-flex align-items-center gap-2 mt-3">
                <img src="${data.author.img}" class="" alt="">
                <div class="d-flex flex-column text-muted fs-6">
                    <span><i class="fa fa-solid fa-user me-1"></i>${
                        data.author.name ? data.author.name : " not found!"
                    }</span>
                    <span><i class="fas fa-calendar-alt me-1"></i>${
                        data.author.published_date
                            ? data.author.published_date
                            : "Coming soon!"
                    }</span>
                </div>
            </div>
            <div class="d-flex flex-column text-muted w-50 text-center fw-bolder fs-6 align-items-end">
                    
            <span><i class="fa fa-regular fa-eye me-2"></i>${
                data.total_view ? data.total_view+" M" : "not found!"
            }</span>
            <span>Today's Pick: ${picked}</span>
            <span>Trending: ${trending}</span>
            <span>Rating: ${data.rating.number}(${data.rating.badge})</span>
            </div>
        </div>
    `

    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `
        <img class="w-100 border border-4 border-secondary" src="${
            data.thumbnail_url ? data.thumbnail_url : data.image_url
        }" alt="" />

        <div class="bg-secondary text-light border-secondary p-2">
            ${data.details}
        </div> 
    `;
};
/*------------------------------------------------------*/
let bindEventListenerToShowModal = () => {
    let readMoreButtons = document.getElementsByClassName("read-more");

    for (let readMore of readMoreButtons) {
        readMore.setAttribute("data-bs-toggle", "modal");
        readMore.setAttribute("data-bs-target", "#exampleModal");

        readMore.addEventListener("click", function (event) {
            event.preventDefault();
            toggleSpinner(false);

            let button = event.target;
            let id = button.getAttribute("id");
            let url = `https://openapi.programming-hero.com/api/news/${id}`;
            fetch(url)
                .then((res) => res.json())
                .then((data) => addToModal(data.data[0]))
                .catch(err => {
                    console.error("There was an error: ", err); // error handling
                })
        });
    }
};

/*------------------------------------------------------*/
let displaySelectedCategoryNews = (newsPosts) => {
    let newsPostCounter = newsPosts.length;
    document.getElementById("result-counter").innerText =
        "( " + newsPostCounter + " )";
    let selectedNewsContainer = document.getElementById("news-container");
    selectedNewsContainer.innerHTML = "";
    
    if(!newsPostCounter){
        selectedNewsContainer.innerHTML=`
        <div class=" w-75 mx-auto">    
            <img src="images/notFound.png" class="mt-3 w-25 d-block mx-auto">
            <h3 class="no-found text-center text-danger">Sorry! No data found</h3>
        </div>
        `
    }
    toggleSpinner(true);

    newsPosts = getPopularPosts([...newsPosts]);

    newsPosts.forEach((post) => {
        let article = document.createElement("article");
        article.className = "d-flex flex-md-row flex-column gap-3 mx-3 single-post mb-4 px-4 py-4";

        let text = post.details.slice(0, 500);
        if (post.details.length > 500) {
            text += " ...";
        }

        // calculate rating-star based on the rating.
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
                <div class="d-flex flex-md-row flex-column justify-content-between  align-items-center  text-muted">
                    <div class="author d-flex align-items-center gap-2 mt-3">
                        <img src="${post.author.img}" class="" alt="">
                        <div class="d-flex flex-column text-muted fs-6">
                            <span><i class="fa fa-solid fa-user me-1"></i>${
                                post.author.name
                                    ? post.author.name
                                    : "not found!"
                            }</span>
                            <span><small><i class="fas fa-calendar-alt me-1"></i>${
                                post.author.published_date
                                    ? post.author.published_date
                                    : "Coming soon!"
                            }</small></span>
                        </div>
                    </div>
                    <div class="total-view fw-bolder fs-6 mx-3"><i class="fa fa-regular fa-eye me-2"></i>${
                        post.total_view ? post.total_view+" M" : "not found!"
                    }</div>
                    <div class="rating-text ms-2 text-warning">${ratingText}</div>
                </div>
            </section>
        `;
        selectedNewsContainer.appendChild(article);
    });

    bindEventListenerToShowModal();
};

// sort the posts by Total Views
let getPopularPosts = (posts) => {
    return posts.sort(function (a, b) {
        return b.total_view - a.total_view;
    });
};

/*------------------------------------------------------*/
// if it's paremeter is false, then spinner shows
// otherwise, it hides

let toggleSpinner = isHide => {
    let spinner = document.getElementById('spinner');
    if(isHide){
        spinner.classList.add('hide-spinner');
    }
    else{
        spinner.classList.remove('hide-spinner');
    }
}
// default functions caller

toggleSpinner(false);
loadCategories();
