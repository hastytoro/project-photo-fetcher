let galleryGrid = document.querySelector(".gallery");
let searchInput = document.querySelector(".search-input");
let form = document.querySelector(".search-form");
let moreBtn = document.querySelector(".moreBtn");
let loading = document.querySelector(".modal-wrapper");

// APPLICATION STATE
let website = "https://api.pexels.com/v1/";
let page = 1; // initialized page state
let searchValue;
let currentSearch;
let currentLink;

let apiKey = "563492ad6f917000010000013d97fca6d9394882b078d71f8a15759b";

// EVENT LISTENER:
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value;
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
moreBtn.addEventListener("click", loadMore);

function generateHtml(data) {
  loading.classList.add("active");
  data.photos.forEach((photo) => {
    const photoDiv = document.createElement("div");
    photoDiv.classList.add("gallery-img");
    // console.log(photo);
    photoDiv.innerHTML = `
    <div class='gallery-info'> 
      <p>${photo.photographer}</p>
      <a class="download" href=${photo.src.original}>Download</a>
    </div>
    <div class="gallery-img-wrapper">
      <img src=${photo.src.large}></img>
    </div>
    `;
    galleryGrid.appendChild(photoDiv);
  });
  loading.classList.remove("active");
}

function clear() {
  galleryGrid.innerHTML = "";
  searchInput.value = "";
}

// ASYNC FUNCTIONS / PROMISE API
async function photosApi(url) {
  loading.classList.add("active");
  let dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: apiKey,
    },
  });
  loading.classList.remove("active");
  return await dataFetch.json();
}

async function initialPhotos() {
  clear();
  currentLink = `${website}curated?per_page15&page=1`;
  let data = await photosApi(currentLink);
  generateHtml(data);
}

async function searchPhotos(search) {
  clear();
  currentLink = `${website}search?query=${search}+query&per_page=15&page=1`;
  let data = await photosApi(currentLink);
  console.log(data);
  generateHtml(data);
}

async function loadMore() {
  page++;
  console.log(currentSearch);
  currentSearch
    ? (currentLink = `${website}search?query=${currentSearch}+query&per_page=15&page=${page}`)
    : (currentLink = `${website}curated?per_page15&page=${page}`);
  const data = await photosApi(currentLink);
  generateHtml(data);
}

initialPhotos();
