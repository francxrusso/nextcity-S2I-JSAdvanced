
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

      //start the loader animation
      loader.classList.toggle("hidden");
      //delete results from the section
      resultSection.innerHTML = "";