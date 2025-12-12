// ========== SELEÇÃO DE ELEMENTOS ==========
const loginLink = document.getElementById("login-link");
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const recoveryModal = document.getElementById("recovery-modal");
const modalOverlay = document.getElementById("modal-overlay");

// Botões de fechar
const closeLoginBtn = document.getElementById("close-login");
const closeRegisterBtn = document.getElementById("close-register");
const closeRecoveryBtn = document.getElementById("close-recovery");

// Links de navegação entre modais
const registerLink = document.getElementById("register-link");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const backToLoginLink = document.getElementById("back-to-login-link");
const backToLoginFromRecoveryLink = document.getElementById(
  "back-to-login-from-recovery"
);
const registerInstructorLink = document.getElementById(
  "register-instructor-link"
);

// Formulários
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const recoveryForm = document.getElementById("recovery-form");

// ========== FUNÇÕES DE CONTROLE DE MODAIS ==========
function openModal(modal) {
  modalOverlay.classList.add("active");
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Previne scroll do body
}

function closeModal(modal) {
  modalOverlay.classList.remove("active");
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restaura scroll do body
}

function closeAllModals() {
  closeModal(loginModal);
  closeModal(registerModal);
  closeModal(recoveryModal);
}

// ========== EVENT LISTENERS - ABERTURA DE MODAIS ==========
loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(loginModal);
});

// ========== EVENT LISTENERS - FECHAMENTO DE MODAIS ==========
closeLoginBtn.addEventListener("click", () => {
  closeModal(loginModal);
});

closeRegisterBtn.addEventListener("click", () => {
  closeModal(registerModal);
});

closeRecoveryBtn.addEventListener("click", () => {
  closeModal(recoveryModal);
});

// Fechar ao clicar no overlay
modalOverlay.addEventListener("click", () => {
  closeAllModals();
});

// Fechar ao pressionar ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
  }
});

// ========== EVENT LISTENERS - NAVEGAÇÃO ENTRE MODAIS ==========
// Do Login para Cadastro
registerLink.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(loginModal);
  setTimeout(() => {
    openModal(registerModal);
  }, 150);
});

// Do Login para Recuperação
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(loginModal);
  setTimeout(() => {
    openModal(recoveryModal);
  }, 150);
});

// Do Cadastro para Login
backToLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(registerModal);
  setTimeout(() => {
    openModal(loginModal);
  }, 150);
});

// Da Recuperação para Login
backToLoginFromRecoveryLink.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(recoveryModal);
  setTimeout(() => {
    openModal(loginModal);
  }, 150);
});

// Cadastro como instrutor (por enquanto abre o mesmo modal de cadastro)
registerInstructorLink.addEventListener("click", (e) => {
  e.preventDefault();
  // Pode ser expandido no futuro para um modal específico de instrutor
  alert("Funcionalidade de cadastro como instrutor em desenvolvimento!");
});

// ========== CONFIGURAÇÃO DA API ==========
const API_BASE_URL = "http://localhost:8080/api";

// ========== FUNÇÕES DE REQUISIÇÃO ==========
async function fazerLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Erro de conexão com o servidor. Tente novamente.");
  }
}

async function fazerCadastro(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer cadastro:", error);
    throw new Error("Erro de conexão com o servidor. Tente novamente.");
  }
}

// ========== VALIDAÇÃO DE FORMULÁRIOS ==========
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um e-mail válido!");
    return;
  }

  // Desabilitar botão durante a requisição
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";

  try {
    const result = await fazerLogin(email, password);

    if (result.success) {
      // Salvar dados do usuário no localStorage
      console.log("Dados do usuário recebidos no login:", result.user);
      console.log("photoUrl no login:", result.user.photoUrl ? (result.user.photoUrl.substring(0, 50) + "...") : "null/vazio");
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("isLoggedIn", "true");

      alert("Login realizado com sucesso! Redirecionando para o dashboard...");
      closeModal(loginModal);
      loginForm.reset();

      // Redirecionar para o dashboard após 1 segundo
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      alert(result.message || "Erro ao fazer login. Tente novamente.");
    }
  } catch (error) {
    alert(error.message || "Erro ao fazer login. Verifique sua conexão e tente novamente.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const phone = document.getElementById("register-phone").value.trim();
  const education = document.getElementById("register-education").value;
  const email = document.getElementById("register-email").value.trim();
  const birthdate = document.getElementById("register-birthdate").value;
  const address = document.getElementById("register-address").value.trim();
  const objective = document.getElementById("register-objective").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;

  // Validação de campos vazios
  if (
    !name ||
    !phone ||
    !education ||
    !email ||
    !birthdate ||
    !address ||
    !objective ||
    !password ||
    !confirmPassword
  ) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um e-mail válido!");
    return;
  }

  // Validação de senha
  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!");
    return;
  }

  // Validação de confirmação de senha
  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  // Converter data de dd/mm/yyyy para yyyy-MM-dd (formato ISO)
  let birthDateFormatted = null;
  if (birthdate) {
    const [day, month, year] = birthdate.split("/");
    if (day && month && year) {
      birthDateFormatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }

  // Processar foto se houver
  const photoInput = document.getElementById("register-photo");
  let photoBase64 = null;

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A foto deve ter no máximo 2MB!");
      return;
    }
    // Converter para base64
    const reader = new FileReader();
    reader.onload = async function(e) {
      photoBase64 = e.target.result;
      await submitRegistration();
    };
    reader.readAsDataURL(file);
    return; // Retornar aqui, o submit será feito no callback
  }

  await submitRegistration();

  async function submitRegistration() {
    // Preparar dados para envio
    const userData = {
      name,
      phone,
      educationLevel: education,
      email,
      birthDate: birthDateFormatted,
      address,
      objective,
      password,
      photoUrl: photoBase64 || null,
    };

    // Desabilitar botão durante a requisição
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Cadastrando...";

    try {
      const result = await fazerCadastro(userData);

      if (result.success) {
        alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
        closeModal(registerModal);
        registerForm.reset();
        // Limpar preview da foto
        const photoPreview = document.getElementById("photo-preview");
        const photoPreviewImg = document.getElementById("photo-preview-img");
        if (photoPreview) photoPreview.style.display = "none";
        if (photoPreviewImg) photoPreviewImg.src = "";

        // Abrir modal de login após 1 segundo
        setTimeout(() => {
          openModal(loginModal);
        }, 1000);
      } else {
        alert(result.message || "Erro ao realizar cadastro. Tente novamente.");
      }
    } catch (error) {
      alert(error.message || "Erro ao realizar cadastro. Verifique sua conexão e tente novamente.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
});

recoveryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("recovery-email").value.trim();

  if (!email) {
    alert("Por favor, digite seu e-mail!");
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um e-mail válido!");
    return;
  }

  // Se passou na validação, pode enviar (aqui você faria a requisição ao servidor)
  alert(
    "E-mail de recuperação enviado! Verifique sua caixa de entrada. (Funcionalidade em desenvolvimento)"
  );
  closeModal(recoveryModal);
  recoveryForm.reset();
});

// ========== FUNCIONALIDADE DE MOSTRAR/OCULTAR SENHA ==========
const togglePasswordBtn = document.getElementById("toggle-password");
const passwordInput = document.getElementById("register-password");

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Atualizar ícone (opcional - pode ser melhorado com ícones diferentes)
    const svg = togglePasswordBtn.querySelector("svg");
    if (type === "text") {
      svg.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    } else {
      svg.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  });
}

// ========== MÁSCARA PARA DATA DE NASCIMENTO ==========
const birthdateInput = document.getElementById("register-birthdate");
if (birthdateInput) {
  birthdateInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + "/" + value.substring(5, 9);
    }
    e.target.value = value;
  });
}

// ========== PREVIEW DA FOTO ==========
const photoInput = document.getElementById("register-photo");
if (photoInput) {
  photoInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById("photo-preview");
        const previewImg = document.getElementById("photo-preview-img");
        if (preview && previewImg) {
          previewImg.src = e.target.result;
          preview.style.display = "block";
        }
      };
      reader.readAsDataURL(file);
    }
  });
}
