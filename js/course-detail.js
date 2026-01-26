// ========== ACCORDION DE MÓDULOS ==========
document.addEventListener("DOMContentLoaded", function () {
  const moduleHeaders = document.querySelectorAll(".module-header");

  moduleHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const moduleItem = this.closest(".module-item");
      const moduleContent = moduleItem.querySelector(".module-content");
      const isActive = moduleItem.classList.contains("active");

      // Fechar todos os módulos
      document.querySelectorAll(".module-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Abrir o módulo clicado se não estava ativo
      if (!isActive) {
        moduleItem.classList.add("active");
      }
    });
  });

  // Abrir o primeiro módulo por padrão
  if (moduleHeaders.length > 0) {
    moduleHeaders[0].closest(".module-item").classList.add("active");
  }
});
