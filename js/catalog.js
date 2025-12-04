// ========== FILTROS DO CATÁLOGO ==========
document.addEventListener("DOMContentLoaded", function () {
  const filterCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][name="category"]'
  );
  const filterRadios = document.querySelectorAll('input[type="radio"]');
  const clearFiltersBtn = document.getElementById("clear-filters");
  const courseCards = document.querySelectorAll(".course-card");

  // Aplicar filtros
  function applyFilters() {
    const selectedCategories = Array.from(
      document.querySelectorAll(
        'input[type="checkbox"][name="category"]:checked'
      )
    ).map((cb) => cb.value);

    const selectedLevel = document.querySelector(
      'input[type="radio"][name="level"]:checked'
    )?.value;
    const selectedRating = document.querySelector(
      'input[type="radio"][name="rating"]:checked'
    )?.value;
    const selectedDuration = document.querySelector(
      'input[type="radio"][name="duration"]:checked'
    )?.value;

    courseCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardLevel = card.getAttribute("data-level");
      const cardRating = parseInt(card.getAttribute("data-rating"));

      let show = true;

      // Filtrar por categoria
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(cardCategory)
      ) {
        show = false;
      }

      // Filtrar por nível
      if (
        selectedLevel &&
        selectedLevel !== "any" &&
        cardLevel !== selectedLevel
      ) {
        show = false;
      }

      // Filtrar por avaliação
      if (selectedRating && selectedRating !== "any") {
        const minRating = parseInt(selectedRating);
        if (cardRating < minRating) {
          show = false;
        }
      }

      // Duração não está implementada nos cards, mas a lógica está pronta
      if (show) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.3s ease";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Event listeners para filtros
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", applyFilters);
  });

  // Limpar filtros
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
      filterCheckboxes.forEach((cb) => (cb.checked = false));
      filterRadios.forEach((radio) => {
        if (
          radio.value === "any" ||
          (radio.name === "level" && radio.value === "beginner")
        ) {
          radio.checked = true;
        } else {
          radio.checked = false;
        }
      });
      applyFilters();
    });
  }

  // Animação de fade in
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});
