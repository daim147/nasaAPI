const resultNav = document.getElementById("resultNav");
const favoritesItem = document.getElementById("favorite");
const moreImage = document.getElementById("moreImage");
const imagesContainer = document.querySelector(".images-container");
const savedConfirm = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
// NASA API
const count = 10;
const apiKey = `xKV6oFapgDag5XfRpa4Zgidt1gfkum333doP17KT`;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};
let showFav = false;

const localData = JSON.parse(localStorage.getItem("nasaFavorite"));

if (localData) {
  favorites = localData;
}

function loadingFav() {
  showFav = !showFav;
  if (showFav) {
    favoritesItem.textContent = `Back to Home Page`;
    console.log(favoritesItem.nextElementSibling, "hy");
    favoritesItem.nextElementSibling.hidden = true;
    favoritesItem.nextElementSibling.nextElementSibling.hidden = true;
  } else {
    favoritesItem.textContent = `Favorites`;
    favoritesItem.nextElementSibling.hidden = false;
    favoritesItem.nextElementSibling.nextElementSibling.hidden = false;
  }
  updateDom();
}

// UPDATE DOM

function updateDom() {
  imagesContainer.innerHTML = "";
  const data = showFav ? Object.values(favorites) : resultArray;
  data.forEach((item) => {
    // CARD CONATINER
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = item.hdurl;
    link.title = "View Full Image";
    link.target = "_target";
    // IMAGE
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = "NASA PICTURE OF DAY";
    // Image.loading = "lazy";
    img.classList.add("card-img-top");
    // CARD BODY

    const cardBody = document.createElement("div");

    cardBody.classList.add("card-body");
    // CARD TITLE
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = item.title;
    // SAVE TEXT
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (showFav) {
      saveText.textContent = `Remove from Favorites`;
      saveText.addEventListener("click", removeFavorite.bind(`${item.url}`));
    } else {
      saveText.textContent = `Add to Favorites`;
      saveText.addEventListener("click", saveFavorite.bind(`${item.url}`));
    }

    // saveText.setAttribute('onclick', `saveFavorite('${item.url}')`)
    // CARD TEXT
    const cardText = document.createElement("p");
    cardText.textContent = item.explanation;
    // FOOTER
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // DATE
    const date = document.createElement("strong");
    date.textContent = item.date;
    // COPYRIGHT
    const copyright = document.createElement("span");
    copyright.textContent = item.copyright ? `  ${item.copyright}` : "";
    // APPEND
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(img);
    card.append(link, cardBody);
    loader.classList.add("hidden");
    imagesContainer.classList.remove("hidden");
    imagesContainer.appendChild(card);
  });
}

// GEt 10 images from NASA Api
async function getNasaPicture() {
  try {
    loader.classList.remove("hidden");
    imagesContainer.classList.add("hidden");
    const resp = await fetch(apiURL);
    resultArray = await resp.json();
    updateDom();
  } catch (error) {
    // Catch Error here
  }
}

// ADD result to favorite
function saveFavorite() {
  // looping result array to select favoruite
  resultArray.forEach((i) => {
    if (i.url.includes(this) && !favorites[this]) {
      favorites[this] = i;
      //   Show Save confrimation for 2
      savedConfirm.hidden = false;
      setTimeout(() => {
        savedConfirm.hidden = true;
      }, 2000);
      localStorage.setItem("nasaFavorite", JSON.stringify(favorites));
    }
  });
}

function removeFavorite() {
  delete favorites[this];
  localStorage.setItem("nasaFavorite", JSON.stringify(favorites));
  updateDom();
}

getNasaPicture();

favoritesItem.addEventListener("click", loadingFav);
moreImage.addEventListener("click", getNasaPicture);


