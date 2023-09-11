// function to display items in UI
function updateUI(data) {
  const resultSection = document.querySelector("#result");
  resultSection.innerHTML = ""; // remove previous results

  if (!data) {
    // show error message if there is no city
    const errorElement = document.createElement("p");
    errorElement.innerHTML =
      "Mhh seems that your city doesn't exist, try again!🤔";
    resultSection.appendChild(errorElement);
    resultSection.style.display = "block";
    return;
  }

  const cityName = data["matching_full_name"];
  const population = data["_embedded"]["city:item"]["population"];
  const cityScore =
    data["_embedded"]["city:item"]["_embedded"]["city:urban_area"]["_embedded"][
      "ua:scores"
    ]["teleport_city_score"];
  const summary =
    data["_embedded"]["city:item"]["_embedded"]["city:urban_area"]["_embedded"][
      "ua:scores"
    ]["summary"];
  const categories =
    data["_embedded"]["city:item"]["_embedded"]["city:urban_area"]["_embedded"][
      "ua:scores"
    ]["categories"];

  const cityTitle = document.createElement("h2");
  cityTitle.innerHTML = cityName;

  const summaryElement = document.createElement("p");
  summaryElement.classList.add("sum");
  summaryElement.innerHTML = summary;

  const overallScore = document.createElement("h3");
  overallScore.innerHTML = `<i class="fa-solid fa-building-circle-check"></i> Overall Score: ${cityScore}`;

  const populationElement = document.createElement("h3");
  populationElement.innerHTML = `<i class="fa-solid fa-person-shelter"></i> Population: ${population}`;

  const categoryList = document.createElement("ul");
  // func to create a list of categories
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.classList.add("listacat");
    li.textContent = `${category.name}: ${category.score_out_of_10}`;
    categoryList.appendChild(li);
  });

  //append every element to the result section
  resultSection.appendChild(cityTitle);
  resultSection.appendChild(summaryElement);
  resultSection.appendChild(overallScore);
  resultSection.appendChild(populationElement);
  resultSection.appendChild(categoryList);

  resultSection.style.display = "block";
}

// function for the API request
async function fetchData(cityName) {
  const baseUrl = "https://api.teleport.org/api/cities/?search=";
  const embedQuery =
    "&embed=city:search-results/city:item/city:urban_area/ua:scores";

  //show the loader to give users a feedback
  const loader = document.querySelector(".loader");
  loader.classList.toggle("hidden");

  try {
    const response = await fetch(baseUrl + cityName + embedQuery);

    if (!response.ok) {
      throw new Error("Error on the API request. Please try again.");
    }

    const data = await response.json();

    const cityData = data._embedded["city:search-results"][0];
    return cityData;
  } catch (error) {
    throw error;
  }
}

//function to handle errors
function handleError(error) {
  const resultSection = document.querySelector("#result");
  resultSection.innerHTML = ""; // Remove previous results

  //remove the loader
  const loader = document.querySelector(".loader");
  loader.classList.toggle("hidden");

  const errorElement = document.createElement("p");
  errorElement.textContent = error.message;
  resultSection.appendChild(errorElement);
  resultSection.style.display = "block";
}

// Event listener on the form to get the results
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchField = document.querySelector("#city-input");
  const cityName = searchField.value;

  try {
    const cityData = await fetchData(cityName);
    updateUI(cityData);
    searchField.value = ""; // delete the previous search from the input
  } catch (error) {
    handleError(error);
  }
});
