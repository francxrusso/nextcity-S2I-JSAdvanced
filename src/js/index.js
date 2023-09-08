// select HTML elements input, button and section
const submitBtn = document.querySelector("#submit-btn");
const searchField = document.querySelector("#city-input");
const resultSection = document.querySelector("#result");

//function to retrieve city's data with Teleport API
async function getCity(name) {
  try {
    //delete results from the section
    resultSection.innerHTML = "";
    //create the base URL with his query
    const baseUrl = "https://api.teleport.org/api/cities/?search=";
    const embedQuery =
      "&embed=city:search-results/city:item/city:urban_area/ua:scores";
    //put together base url, search word in the input + query
    let city = await fetch(baseUrl + name + embedQuery);
    // get and error if the city doesn't exist
    if (city.status !== 200) {
      throw Error(
        "Mhh it looks like the city you are looking for doesnt exist, try again! 🤔"
      );
    }
    city = await city.json();

    const data = city["_embedded"]["city:search-results"][0];
    console.log(data);
    // got the data now select each element to display
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

    //display result section
    resultSection.style.display = "block";

    // create and add content to HTML elements
    const cityTitle = document.createElement("h2");
    cityTitle.innerHTML = cityName;

    const summaryElement = document.createElement("p");
    summaryElement.classList.add("sum");
    summaryElement.innerHTML = summary;

    const overallScore = document.createElement("h3");
    overallScore.innerHTML = `<i class="fa-solid fa-building-circle-check"></i> Overall Score: ${cityScore}`;

    const populationElement = document.createElement("h3");
    populationElement.innerHTML = `<i class="fa-solid fa-person-shelter"></i> Population: ${population}`;

    const categories =
      data["_embedded"]["city:item"]["_embedded"]["city:urban_area"][
        "_embedded"
      ]["ua:scores"]["categories"];
    // create <ul> to create a list of categories
    const categoryList = document.createElement("ul");

    // append elements to result section
    resultSection.appendChild(cityTitle);
    resultSection.appendChild(summaryElement);
    resultSection.appendChild(overallScore);
    resultSection.appendChild(populationElement);

    //show categories as a list and append it to the section
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.classList.add("listacat");
      li.innerHTML = `${category.name}: ${category.score_out_of_10}`;
      categoryList.appendChild(li);
      resultSection.appendChild(categoryList);
    });
  } catch (e) {
    //handling errors
    console.error(e.message);
    alert("The city you are looking for doesn't exist, try again!🤔");
  }
}

//event listener on the form
const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = searchField.value;
  await getCity(cityName);

  //delete previous search from the field
  searchField.value = "";
});
