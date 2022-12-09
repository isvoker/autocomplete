# autocomplete

Пример вызова 
let params = {
  ajaxOption: (query) => {
    return {
      controller: 'shop',
      action: 'catalogSearchAutocomplete',
      q: query
    }
  },
  container: 'js__autocomplete_search',
  formatter: (elem) => {
    return `<a href="${elem.url}" class="autocomplete__item flex ai-c">
      <img src="${elem.image}" alt="img"/>
      <span>${elem.name}</span>
    </a>`;
  }
}
new Autocomplete(params);

ajaxOption - выше обращение к серверу,
container  - куда будут падать блоки с результатми поиска
formatter  - верстка item результата поиска

