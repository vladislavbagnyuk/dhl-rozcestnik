document.addEventListener("DOMContentLoaded", function() {
  const searchForm = document.getElementById("search-form");
  searchForm.onsubmit = function(e) {
    e.preventDefault();
    const search = document.getElementById("search");
    const row = document.getElementsByClassName("novinky-row")[0];
    if (search && row) {
      const valueToSearch = search.value.toLowerCase();
      for (let i = 0; i < row.children.length; i++) {
        const header = row.children[i].getElementsByClassName("card-title");
        if (
          header.length > 0 &&
          header[0].innerHTML.toLowerCase().includes(valueToSearch)
        ) {
          row.children[i].classList.remove("d-none");
        } else {
          row.children[i].classList.add("d-none");
        }
      }
    }
  };
});
