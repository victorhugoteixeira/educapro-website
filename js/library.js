// ========== NAVEGAÇÃO ENTRE ABAS ==========
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Função para abrir uma aba
  function openTab(tabName) {
    // Remover classe active de todos os botões e conteúdos
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Adicionar classe active ao botão e conteúdo correspondentes
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);

    if (activeButton) {
      activeButton.classList.add("active");
    }

    if (activeContent) {
      activeContent.classList.add("active");
    }
  }

  // Adicionar event listeners aos botões de aba
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      openTab(tabName);
    });
  });

  // ========== PLAYLISTS FUNCTIONALITY ==========
  const playlistCards = document.querySelectorAll(
    ".playlist-card[data-playlist-id]"
  );
  const playlistOverview = document.getElementById("playlist-overview");
  const playlistDetail = document.getElementById("playlist-detail");
  const backToPlaylistsBtn = document.getElementById("back-to-playlists");
  const createPlaylistCard = document.querySelector(".create-playlist-card");

  // Abrir detalhes da playlist
  playlistCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Não abrir se clicar no botão de remover
      if (e.target.closest(".remove-course-btn")) {
        return;
      }

      const playlistId = this.getAttribute("data-playlist-id");
      showPlaylistDetail(playlistId);
    });
  });

  function showPlaylistDetail(playlistId) {
    playlistOverview.style.display = "none";
    playlistDetail.style.display = "block";

    // Aqui você poderia carregar os dados da playlist específica
    // Por enquanto, apenas mostramos a view de detalhes
  }

  // Voltar para a visão geral
  if (backToPlaylistsBtn) {
    backToPlaylistsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      playlistOverview.style.display = "block";
      playlistDetail.style.display = "none";
    });
  }

  // Criar nova playlist
  if (createPlaylistCard) {
    createPlaylistCard.addEventListener("click", function () {
      const playlistName = prompt("Digite o nome da nova playlist:");
      if (playlistName && playlistName.trim()) {
        // Aqui você adicionaria a nova playlist ao grid
        alert(`Playlist "${playlistName}" criada com sucesso!`);
      }
    });
  }

  // Editar nome da playlist
  const editPlaylistNameBtn = document.getElementById("edit-playlist-name");
  if (editPlaylistNameBtn) {
    editPlaylistNameBtn.addEventListener("click", function () {
      const currentName = document.getElementById(
        "playlist-detail-title"
      ).textContent;
      const newName = prompt("Digite o novo nome da playlist:", currentName);
      if (newName && newName.trim()) {
        document.getElementById("playlist-detail-title").textContent = newName;
      }
    });
  }

  // Remover curso da playlist
  const removeCourseButtons = document.querySelectorAll(".remove-course-btn");
  removeCourseButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const courseId = this.getAttribute("data-course");
      const courseItem = this.closest(".playlist-course-item");

      if (confirm("Tem certeza que deseja remover este curso da playlist?")) {
        courseItem.remove();
        updatePlaylistCourseCount();
      }
    });
  });

  function updatePlaylistCourseCount() {
    const courseCount = document.querySelectorAll(
      ".playlist-course-item"
    ).length;
    const countElement = document.getElementById("playlist-course-count");
    if (countElement) {
      countElement.textContent = courseCount;
    }
  }

  // Adicionar curso à playlist
  const addCourseBtn = document.getElementById("add-course-to-playlist");
  if (addCourseBtn) {
    addCourseBtn.addEventListener("click", function () {
      alert("Funcionalidade de adicionar curso em desenvolvimento!");
      // Aqui você abriria um modal com a lista de cursos disponíveis
    });
  }

  // Salvar alterações da playlist
  const savePlaylistBtn = document.getElementById("save-playlist-btn");
  if (savePlaylistBtn) {
    savePlaylistBtn.addEventListener("click", function () {
      alert("Alterações salvas com sucesso!");
    });
  }

  // Excluir playlist
  const deletePlaylistBtn = document.getElementById("delete-playlist-btn");
  if (deletePlaylistBtn) {
    deletePlaylistBtn.addEventListener("click", function () {
      if (
        confirm(
          "Tem certeza que deseja excluir esta playlist? Esta ação não pode ser desfeita."
        )
      ) {
        alert("Playlist excluída com sucesso!");
        playlistOverview.style.display = "block";
        playlistDetail.style.display = "none";
      }
    });
  }

  // ========== COURSE MENU POPUP ==========
  const courseMenuButtons = document.querySelectorAll(".course-menu-btn");
  const courseMenuPopup = document.getElementById("course-menu-popup");

  courseMenuButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const courseId = this.getAttribute("data-course");
      const rect = this.getBoundingClientRect();

      if (courseMenuPopup) {
        // Posicionar o popup próximo ao botão
        courseMenuPopup.style.top = `${rect.bottom + 8}px`;
        courseMenuPopup.style.left = `${rect.left}px`;
        courseMenuPopup.classList.toggle("active");
      }
    });
  });

  // Fechar popup ao clicar fora
  document.addEventListener("click", function (e) {
    if (
      courseMenuPopup &&
      !e.target.closest(".course-menu-btn") &&
      !e.target.closest(".course-menu-popup")
    ) {
      courseMenuPopup.classList.remove("active");
    }
  });

  // Ações do menu do curso
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const isDanger = this.classList.contains("menu-item-danger");

      if (isDanger) {
        if (confirm("Tem certeza que deseja remover este curso?")) {
          alert("Curso removido com sucesso!");
          courseMenuPopup.classList.remove("active");
        }
      } else {
        alert("Funcionalidade em desenvolvimento!");
        courseMenuPopup.classList.remove("active");
      }
    });
  });

  // ========== EVALUATIONS TAB ==========
  const evaluationFilterButtons = document.querySelectorAll(
    ".filter-btn[data-filter]"
  );
  const pendingEvaluations = document.getElementById("pending-evaluations");
  const evaluatedSection = document.getElementById("evaluated-section");

  evaluationFilterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Atualizar botões ativos
      evaluationFilterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Mostrar/esconder seções
      if (filter === "pending") {
        if (pendingEvaluations) pendingEvaluations.style.display = "grid";
        if (evaluatedSection) evaluatedSection.style.display = "none";
      } else {
        if (pendingEvaluations) pendingEvaluations.style.display = "none";
        if (evaluatedSection) evaluatedSection.style.display = "block";
      }
    });
  });

  // ========== EVALUATION MODAL ==========
  const evaluationModalOverlay = document.getElementById(
    "evaluation-modal-overlay"
  );
  const evaluationModal = document.getElementById("evaluation-modal");
  const closeEvaluationModalBtn = document.getElementById(
    "close-evaluation-modal"
  );
  const evaluateButtons = document.querySelectorAll(".btn-evaluate");
  const evaluationForm = document.getElementById("evaluation-form");
  const starsRating = document.getElementById("stars-rating");
  const starButtons = document.querySelectorAll(".star-btn");
  const evaluationFeedback = document.getElementById("evaluation-feedback");
  const charCount = document.getElementById("char-count");

  let selectedRating = 0;

  // Abrir modal de avaliação
  evaluateButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course");
      openEvaluationModal(courseId);
    });
  });

  function openEvaluationModal(courseId) {
    if (evaluationModalOverlay) {
      evaluationModalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      selectedRating = 0;
      updateStarsDisplay();
    }
  }

  // Fechar modal
  function closeEvaluationModal() {
    if (evaluationModalOverlay) {
      evaluationModalOverlay.classList.remove("active");
      document.body.style.overflow = "";
      if (evaluationForm) evaluationForm.reset();
      selectedRating = 0;
      updateStarsDisplay();
      if (charCount) charCount.textContent = "0";
    }
  }

  if (closeEvaluationModalBtn) {
    closeEvaluationModalBtn.addEventListener("click", closeEvaluationModal);
  }

  if (evaluationModalOverlay) {
    evaluationModalOverlay.addEventListener("click", function (e) {
      if (e.target === evaluationModalOverlay) {
        closeEvaluationModal();
      }
    });
  }

  // Sistema de estrelas
  starButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-rating"));
      updateStarsDisplay();
    });

    btn.addEventListener("mouseenter", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      highlightStars(rating);
    });
  });

  if (starsRating) {
    starsRating.addEventListener("mouseleave", function () {
      updateStarsDisplay();
    });
  }

  function highlightStars(rating) {
    starButtons.forEach((btn, index) => {
      const btnRating = index + 1;
      const icon = btn.querySelector("i");

      if (btnRating <= rating) {
        icon.classList.remove("ph-star");
        icon.classList.add("ph-star-fill");
        btn.classList.add("active");
      } else {
        icon.classList.remove("ph-star-fill");
        icon.classList.add("ph-star");
        btn.classList.remove("active");
      }
    });
  }

  function updateStarsDisplay() {
    starButtons.forEach((btn, index) => {
      const btnRating = index + 1;
      const icon = btn.querySelector("i");

      if (btnRating <= selectedRating) {
        icon.classList.remove("ph-star");
        icon.classList.add("ph-star-fill");
        btn.classList.add("active");
      } else {
        icon.classList.remove("ph-star-fill");
        icon.classList.add("ph-star");
        btn.classList.remove("active");
      }
    });
  }

  // Contador de caracteres
  if (evaluationFeedback && charCount) {
    evaluationFeedback.addEventListener("input", function () {
      charCount.textContent = this.value.length;
    });
  }

  // Submeter avaliação
  if (evaluationForm) {
    evaluationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (selectedRating === 0) {
        alert("Por favor, selecione uma nota!");
        return;
      }

      const feedback = evaluationFeedback.value.trim();
      if (!feedback) {
        alert("Por favor, descreva sua experiência!");
        return;
      }

      // Aqui você enviaria os dados para o servidor
      alert("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");
      closeEvaluationModal();

      // Atualizar a interface (mover curso de pendente para avaliado)
      const courseCard = document.querySelector(
        `.course-evaluate-card[data-course-id="1"]`
      );
      if (courseCard) {
        courseCard.remove();
      }
    });
  }

  // ========== NOTIFICATIONS PAGE ==========
  const notificationFilters = document.querySelectorAll(
    ".filter-tab[data-filter]"
  );
  const notificationItems = document.querySelectorAll(".notification-item");
  const notificationsBtn = document.getElementById("notifications-btn");
  const notificationsActionsModal = document.getElementById(
    "notifications-actions-modal"
  );
  const closeActionsModalBtn = document.getElementById("close-actions-modal");
  const markAllReadBtn = document.getElementById("mark-all-read");
  const loadMoreBtn = document.getElementById("load-more-notifications");

  // Filtrar notificações
  if (notificationFilters.length > 0) {
    notificationFilters.forEach((filter) => {
      filter.addEventListener("click", function () {
        const filterType = this.getAttribute("data-filter");

        // Atualizar botões ativos
        notificationFilters.forEach((f) => f.classList.remove("active"));
        this.classList.add("active");

        // Filtrar notificações
        notificationItems.forEach((item) => {
          const itemType = item.getAttribute("data-type");

          if (filterType === "all" || itemType === filterType) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // Abrir modal de ações
  if (notificationsBtn && notificationsActionsModal) {
    notificationsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      notificationsActionsModal.classList.toggle("active");
    });
  }

  // Fechar modal de ações
  if (closeActionsModalBtn) {
    closeActionsModalBtn.addEventListener("click", function () {
      if (notificationsActionsModal) {
        notificationsActionsModal.classList.remove("active");
      }
    });
  }

  // Fechar modal ao clicar fora
  document.addEventListener("click", function (e) {
    if (
      notificationsActionsModal &&
      !e.target.closest("#notifications-btn") &&
      !e.target.closest(".notifications-actions-modal")
    ) {
      notificationsActionsModal.classList.remove("active");
    }
  });

  // Marcar todas como lidas
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const unreadItems = document.querySelectorAll(
        ".notification-item.unread"
      );
      unreadItems.forEach((item) => {
        item.classList.remove("unread");
        const unreadDot = item.querySelector(".unread-dot");
        if (unreadDot) {
          unreadDot.remove();
        }
      });
      alert("Todas as notificações foram marcadas como lidas!");
    });
  }

  // Carregar mais notificações
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      alert("Carregando mais notificações...");
      // Aqui você carregaria mais notificações do servidor
    });
  }

  // Marcar notificação como lida ao clicar
  notificationItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (this.classList.contains("unread")) {
        this.classList.remove("unread");
        const unreadDot = this.querySelector(".unread-dot");
        if (unreadDot) {
          unreadDot.remove();
        }
      }
    });
  });

  // ========== ESC KEY TO CLOSE MODALS ==========
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (evaluationModalOverlay?.classList.contains("active")) {
        closeEvaluationModal();
      }
      if (notificationsActionsModal?.classList.contains("active")) {
        notificationsActionsModal.classList.remove("active");
      }
      if (courseMenuPopup?.classList.contains("active")) {
        courseMenuPopup.classList.remove("active");
      }
    }
  });
});
