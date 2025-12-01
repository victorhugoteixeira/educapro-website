// ========== NAVEGAÇÃO ENTRE ABAS (SETTINGS PAGE) ==========
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se estamos na página de configurações
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const tabContents = document.querySelectorAll(".tab-content");

  if (sidebarItems.length > 0) {
    // Adicionar event listeners aos itens da sidebar
    sidebarItems.forEach((item) => {
      item.addEventListener("click", function () {
        const targetTab = this.getAttribute("data-tab");

        // Remover classe active de todos os itens
        sidebarItems.forEach((sidebarItem) => {
          sidebarItem.classList.remove("active");
        });

        // Adicionar classe active ao item clicado
        this.classList.add("active");

        // Esconder todos os conteúdos de abas
        tabContents.forEach((content) => {
          content.classList.remove("active");
        });

        // Mostrar o conteúdo da aba selecionada
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });
  }

  // ========== MODAL ALTERAR DADOS ==========
  const editModalOverlay = document.getElementById("edit-modal-overlay");
  const openEditModalBtn = document.getElementById("open-edit-modal");
  const closeEditModalBtn = document.getElementById("close-edit-modal");
  const backToProfileLink = document.getElementById("back-to-profile");
  const editDataForm = document.getElementById("edit-data-form");

  // Abrir modal
  if (openEditModalBtn) {
    openEditModalBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (editModalOverlay) {
        editModalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }

  // Fechar modal
  function closeEditModal() {
    if (editModalOverlay) {
      editModalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener("click", closeEditModal);
  }

  if (backToProfileLink) {
    backToProfileLink.addEventListener("click", function (e) {
      e.preventDefault();
      closeEditModal();
      // Voltar para a aba de perfil
      const profileTab = document.querySelector('[data-tab="profile"]');
      if (profileTab) {
        profileTab.click();
      }
    });
  }

  // Fechar modal ao clicar no overlay
  if (editModalOverlay) {
    editModalOverlay.addEventListener("click", function (e) {
      if (e.target === editModalOverlay) {
        closeEditModal();
      }
    });
  }

  // Fechar modal com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && editModalOverlay?.classList.contains("active")) {
      closeEditModal();
    }
  });

  // Submeter formulário do modal
  if (editDataForm) {
    editDataForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("edit-name").value.trim();
      const username = document.getElementById("edit-username").value.trim();
      const email = document.getElementById("edit-email").value.trim();
      const gender = document.getElementById("edit-gender").value;

      // Validação básica
      if (!name || !username) {
        alert("Por favor, preencha pelo menos o nome e nome de usuário!");
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Por favor, insira um e-mail válido!");
          return;
        }
      }

      // Aqui você faria a requisição ao servidor
      alert("Dados alterados com sucesso!");

      // Atualizar os campos do perfil principal se necessário
      const profileName = document.getElementById("profile-name");
      if (profileName) {
        profileName.value = name;
      }

      closeEditModal();
    });
  }

  // ========== TOGGLE PASSWORD VISIBILITY ==========
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);
      const icon = this.querySelector("i");

      if (passwordInput) {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          icon.classList.remove("ph-eye");
          icon.classList.add("ph-eye-slash");
        } else {
          passwordInput.type = "password";
          icon.classList.remove("ph-eye-slash");
          icon.classList.add("ph-eye");
        }
      }
    });
  });

  // ========== FORMULÁRIO DE SENHA E SEGURANÇA ==========
  const securityForm = document.querySelector(".security-form");

  if (securityForm) {
    securityForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      if (newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres!");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }

      // Aqui você faria a requisição ao servidor
      alert("Senha alterada com sucesso!");
      securityForm.reset();
    });
  }

  // ========== SALVAR NOTIFICAÇÕES ==========
  const saveNotificationsBtn = document.getElementById("save-notifications");

  if (saveNotificationsBtn) {
    saveNotificationsBtn.addEventListener("click", function () {
      const emailNotifications = document.getElementById(
        "email-notifications"
      ).checked;
      const pushNotifications =
        document.getElementById("push-notifications").checked;
      const newsletter = document.getElementById("newsletter").checked;

      // Aqui você faria a requisição ao servidor
      alert("Preferências de notificações salvas com sucesso!");
    });
  }

  // ========== SALVAR PRIVACIDADE ==========
  const savePrivacyBtn = document.getElementById("save-privacy");

  if (savePrivacyBtn) {
    savePrivacyBtn.addEventListener("click", function () {
      const profileVisibility = document.querySelector(
        'input[name="profile-visibility"]:checked'
      )?.value;
      const dataConsent = document.getElementById("data-consent").checked;

      // Aqui você faria a requisição ao servidor
      alert("Configurações de privacidade salvas com sucesso!");
    });
  }

  // ========== BAIXAR DADOS ==========
  const downloadDataBtn = document.getElementById("download-data");

  if (downloadDataBtn) {
    downloadDataBtn.addEventListener("click", function () {
      // Aqui você faria a requisição ao servidor para gerar o arquivo
      alert(
        "Sua solicitação foi enviada! Você receberá um e-mail com o link para download dos seus dados em breve."
      );
    });
  }

  // ========== DELETAR CONTA ==========
  const deleteAccountBtn = document.getElementById("delete-account-btn");

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", function () {
      const confirmMessage =
        "Tem certeza que deseja excluir sua conta permanentemente?\n\n" +
        "Esta ação não pode ser desfeita e você perderá:\n" +
        "- Todos os seus cursos\n" +
        "- Certificados\n" +
        "- Histórico de progresso\n" +
        "- Todos os seus dados pessoais\n\n" +
        "Digite 'CONFIRMAR' para prosseguir:";

      const userConfirmation = prompt(confirmMessage);

      if (userConfirmation === "CONFIRMAR") {
        // Aqui você faria a requisição ao servidor
        alert(
          "Sua conta será excluída em até 30 dias. Você receberá um e-mail de confirmação."
        );
        // Redirecionar para a página inicial após um tempo
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        alert("Exclusão de conta cancelada.");
      }
    });
  }

  // ========== SALVAR PERFIL ==========
  const profileForm = document.querySelector(".profile-form");

  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("profile-name").value.trim();
      const title = document.getElementById("profile-title").value.trim();
      const description = document
        .getElementById("profile-description")
        .value.trim();
      const linkedin = document.getElementById("profile-linkedin").value.trim();
      const github = document.getElementById("profile-github").value.trim();
      const website = document.getElementById("profile-website").value.trim();

      if (!name) {
        alert("Por favor, preencha pelo menos o nome completo!");
        return;
      }

      // Validação de URLs
      const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

      if (linkedin && !urlRegex.test(linkedin)) {
        alert("Por favor, insira uma URL válida para o LinkedIn!");
        return;
      }

      if (github && !urlRegex.test(github)) {
        alert("Por favor, insira uma URL válida para o GitHub!");
        return;
      }

      if (website && !urlRegex.test(website)) {
        alert("Por favor, insira uma URL válida para o website!");
        return;
      }

      // Aqui você faria a requisição ao servidor
      alert("Perfil atualizado com sucesso!");
    });
  }

  // ========== ANIMAÇÃO DOS GRÁFICOS CIRCULARES (DASHBOARD) ==========
  const progressCircles = document.querySelectorAll(
    ".progress-circle, .secondary-progress-circle, .frequency-circle"
  );

  function animateProgressCircle(circle) {
    const progress = parseInt(circle.getAttribute("data-progress")) || 0;
    const circleElement = circle.querySelector(".progress-ring-circle");

    if (circleElement) {
      const radius = parseFloat(circleElement.getAttribute("r"));
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (progress / 100) * circumference;

      // Inicializar com offset completo (0% visível)
      circleElement.style.strokeDasharray = `${circumference}`;
      circleElement.style.strokeDashoffset = `${circumference}`;

      // Animar para o valor correto
      setTimeout(() => {
        circleElement.style.strokeDashoffset = `${offset}`;
      }, 100);
    }
  }

  // Se estiver na página do dashboard, animar imediatamente
  if (document.querySelector(".dashboard-main")) {
    progressCircles.forEach((circle) => {
      animateProgressCircle(circle);
    });
  } else {
    // Caso contrário, observar quando os elementos entram na viewport
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateProgressCircle(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    progressCircles.forEach((circle) => {
      observer.observe(circle);
    });
  }
});
