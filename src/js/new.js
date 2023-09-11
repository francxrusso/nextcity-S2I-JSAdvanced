// Funzione per creare elementi HTML
function createHTMLElement(tag, textContent) {
  const element = document.createElement(tag);
  element.textContent = textContent;
  return element;
}

// Funzione per gestire l'interfaccia utente e il loader
function updateUI(data) {
  const resultSection = document.querySelector("#result");
  const loader = document.querySelector(".loader");
  loader.classList.remove("hidden");

  resultSection.innerHTML = ""; // Rimuovi contenuto precedente

  if (!data) {
    // Mostra messaggio di errore se non ci sono dati
    resultSection.appendChild(
      createHTMLElement(
        "p",
        "Mhh seems that your city doesn't exist, try again!🤔"
      )
    );
    resultSection.style.display = "block";
  } else {
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

    const elements = [
      createHTMLElement("h2", cityName),
      createHTMLElement("p", summary),
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
    // Funzione per creare una lista di categorie
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.classList.add("listacat");
      li.textContent = `${category.name}: ${category.score_out_of_10}`;
      categoryList.appendChild(li);
    });

    elements.push(categoryList);

    // Aggiungi elementi alla sezione dei risultati
    elements.forEach((element) => resultSection.appendChild(element));

    resultSection.style.display = "block";
  }

  loader.classList.add("hidden"); // Nascondi il loader
}

// ... (Resto del codice rimane invariato)
