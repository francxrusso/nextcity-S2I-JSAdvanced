//select section and loader div
const resultSection = document.querySelector("#result");
const loader = document.querySelector(".loader");

// function for the API request
async function fetchData(cityName) {
  const baseUrl = "https://api.teleport.org/api/cities/?search=";
  const embedQuery =
    "&embed=city:search-results/city:item/city:urban_area/ua:scores";

  //remove previous results from the section
  resultSection.innerHTML = "";

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

// function to create HTML elements
function createHTMLElement(tag, content) {
  const element = document.createElement(tag);
  element.innerHTML = content;
  return element;
}

// function to display items in UI
function updateUI(data) {
  if (!data) {
    // show error message if the city is not available in the API
    resultSection.appendChild(
      createHTMLElement(
        "p",
        "Mhh seems that your city doesn't exist, try again!🤔"
      )
    );
    resultSection.style.display = "block";
  } else {
    //if the city exist take these data from the API
    const cityName = data["matching_full_name"];
    const population = data["_embedded"]["city:item"]["population"];
    const cityScore =
      data["_embedded"]["city:item"]["_embedded"]["city:urban_area"][
        "_embedded"
      ]["ua:scores"]["teleport_city_score"];
    const summary =
      data["_embedded"]["city:item"]["_embedded"]["city:urban_area"][
        "_embedded"
      ]["ua:scores"]["summary"];
    const categories =
      data["_embedded"]["city:item"]["_embedded"]["city:urban_area"][
        "_embedded"
      ]["ua:scores"]["categories"];
    //create HTML elements and show them in the result section

    // Create a <p> element with the "sum" class for the summary
    const summaryElement = createHTMLElement("p", summary);
    summaryElement.classList.add("sum");

    const elements = [
      createHTMLElement("h2", cityName),
      summaryElement,
      createHTMLElement(
        "h3",
        `<i class="fa-solid fa-building-circle-check"></i> Overall Score: ${cityScore}`
      ),
      createHTMLElement(
        "h3",
        `<i class="fa-solid fa-person-shelter"></i> Population: ${population}`
      ),
    ];

    const categoryList = document.createElement("ul");
    // func to create a list of categories
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.classList.add("listacat");
      li.textContent = `${category.name}: ${category.score_out_of_10}`;
      categoryList.appendChild(li);
    });
    elements.push(categoryList);

    //append every element to the result section
    elements.forEach((element) => resultSection.appendChild(element));

    resultSection.style.display = "block";
  }
}

//function to handle errors
function handleError(error) {
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
  //show the loader to give users a feedback
  loader.classList.toggle("hidden");

  try {
    const cityData = await fetchData(cityName);
    updateUI(cityData);
    searchField.value = ""; // delete the previous search from the input
    loader.classList.add("hidden"); // remove the loaders
  } catch (error) {
    handleError(error);
  }
});
