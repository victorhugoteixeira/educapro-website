// ========== GERENCIAMENTO DE PERFIL NAS CONFIGURAÇÕES ==========
const API_BASE_URL = "http://localhost:8080/api";

// Função para carregar dados do usuário no formulário
function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user || !user.id) {
    console.error("Usuário não encontrado no localStorage");
    return;
  }

  // Preencher campos do formulário
  const profileName = document.getElementById("profile-name");
  const profilePhone = document.getElementById("profile-phone");
  const profileEmail = document.getElementById("profile-email");
  const profileEducation = document.getElementById("profile-education");
  const profileBirthdate = document.getElementById("profile-birthdate");
  const profileAddress = document.getElementById("profile-address");
  const profileObjective = document.getElementById("profile-objective");
  const profilePhoto = document.querySelector(".profile-photo");

  if (profileName) profileName.value = user.name || "";
  if (profilePhone) profilePhone.value = user.phone || "";
  if (profileEmail) profileEmail.value = user.email || "";
  if (profileEducation) profileEducation.value = user.educationLevel || "";
  if (profileAddress) profileAddress.value = user.address || "";
  if (profileObjective) profileObjective.value = user.objective || "";

  // Formatar data de nascimento
  if (profileBirthdate && user.birthDate) {
    try {
      const date = new Date(user.birthDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      profileBirthdate.value = `${day}/${month}/${year}`;
    } catch (e) {
      console.error("Erro ao formatar data:", e);
    }
  }

  // Atualizar foto de perfil
  if (profilePhoto) {
    console.log("Verificando foto do perfil. photoUrl:", user.photoUrl ? (user.photoUrl.substring(0, 50) + "...") : "null/vazio");
    
    const hasPhoto = user.photoUrl && 
                     typeof user.photoUrl === "string" &&
                     user.photoUrl.trim() !== "" && 
                     user.photoUrl !== "null" && 
                     user.photoUrl.toLowerCase() !== "null" &&
                     !user.photoUrl.startsWith("img/") && // Não usar imagens padrão
                     (user.photoUrl.startsWith("data:image") || user.photoUrl.startsWith("http")); // Deve ser base64 ou URL
    
    console.log("HasPhoto:", hasPhoto);
    
    if (hasPhoto) {
      console.log("Carregando foto do perfil do usuário");
      profilePhoto.src = user.photoUrl;
      profilePhoto.style.display = "block";
      profilePhoto.onerror = function() {
        console.error("Erro ao carregar foto do perfil. URL:", user.photoUrl ? user.photoUrl.substring(0, 100) : "null");
        this.style.display = "none";
        showDefaultPhotoIcon();
      };
      profilePhoto.onload = function() {
        console.log("Foto do perfil carregada com sucesso!");
      };
      // Remover ícone padrão se existir
      const defaultIcon = profilePhoto.parentElement?.querySelector(".default-avatar-icon");
      if (defaultIcon) {
        defaultIcon.remove();
      }
    } else {
      console.log("Usuário não tem foto cadastrada válida. photoUrl:", user.photoUrl);
      profilePhoto.style.display = "none";
      showDefaultPhotoIcon();
    }
  }

  function showDefaultPhotoIcon() {
    const photoWrapper = document.querySelector(".profile-photo-wrapper");
    if (photoWrapper && !photoWrapper.querySelector(".default-avatar-icon")) {
      const icon = document.createElement("i");
      icon.className = "ph ph-user default-avatar-icon";
      icon.style.fontSize = "4rem";
      icon.style.color = "var(--text-white)";
      icon.style.display = "flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.width = "120px";
      icon.style.height = "120px";
      icon.style.borderRadius = "50%";
      icon.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      icon.style.position = "absolute";
      photoWrapper.appendChild(icon);
    }
  }
}

// Função para salvar perfil
async function saveUserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user || !user.id) {
    alert("Erro: Usuário não encontrado. Faça login novamente.");
    return;
  }

  const name = document.getElementById("profile-name").value.trim();
  const phone = document.getElementById("profile-phone").value.trim();
  const education = document.getElementById("profile-education").value;
  const birthdate = document.getElementById("profile-birthdate").value;
  const address = document.getElementById("profile-address").value.trim();
  const objective = document.getElementById("profile-objective").value;

  if (!name || !phone || !education || !address || !objective) {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }

  // Converter data
  let birthDateFormatted = null;
  if (birthdate) {
    const [day, month, year] = birthdate.split("/");
    if (day && month && year) {
      birthDateFormatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }

  // Processar foto se houver nova
  const photoInput = document.getElementById("profile-photo-input");
  let photoBase64 = user.photoUrl || null;

  // Verificar se há uma nova foto selecionada
  if (photoInput && photoInput.files && photoInput.files.length > 0 && photoInput.files[0]) {
    console.log("Nova foto detectada, processando...");
    const file = photoInput.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert("A foto deve ter no máximo 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async function(e) {
      const newPhotoBase64 = e.target.result;
      console.log("Foto convertida para base64, tamanho:", newPhotoBase64.length);
      console.log("Primeiros 100 caracteres:", newPhotoBase64.substring(0, 100));
      await submitUpdate(newPhotoBase64);
    };
    reader.onerror = function(error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Erro ao processar a foto. Tente novamente.");
    };
    reader.readAsDataURL(file);
    return; // Retornar aqui, o submit será feito no callback
  }

  console.log("Nenhuma nova foto, usando foto existente ou null");
  await submitUpdate(photoBase64);

  async function submitUpdate(photoToSend) {
    const userData = {
      name,
      phone,
      educationLevel: education,
      birthDate: birthDateFormatted,
      address,
      objective,
    };

    // Só incluir photoUrl se não for null/vazio
    if (photoToSend && photoToSend.trim() !== "" && photoToSend !== "null" && !photoToSend.startsWith("img/")) {
      userData.photoUrl = photoToSend;
      console.log("Incluindo photoUrl no update, tamanho:", photoToSend.length);
      console.log("photoUrl começa com:", photoToSend.substring(0, 50));
    } else {
      console.log("photoUrl não será atualizado. Valor:", photoToSend);
    }

    console.log("Enviando dados para atualização:", {
      ...userData,
      photoUrl: userData.photoUrl ? (userData.photoUrl.substring(0, 50) + "...") : "null/vazio"
    });

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", response.status, errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Resposta do servidor:", result);

      if (result.success) {
        console.log("Perfil atualizado com sucesso!");
        console.log("Dados do usuário atualizados:", result.user);
        console.log("photoUrl após atualização:", result.user.photoUrl ? (result.user.photoUrl.substring(0, 50) + "...") : "null/vazio");
        
        // Atualizar localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        alert("Perfil atualizado com sucesso!");
        // Recarregar dados
        loadUserProfile();
        // Atualizar perfil em todas as páginas
        if (typeof updateUserProfile === "function") {
          updateUserProfile();
        }
      } else {
        alert(result.message || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Verifique sua conexão e tente novamente.");
    }
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
  // Carregar dados do usuário
  loadUserProfile();

  // Adicionar máscara para data de nascimento
  const birthdateInput = document.getElementById("profile-birthdate");
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

  // Botão de editar foto
  const photoEditBtn = document.querySelector(".photo-edit-btn");
  const photoInput = document.getElementById("profile-photo-input");
  const profilePhoto = document.querySelector(".profile-photo");
  
  // Adicionar event listener ao input de foto (se existir)
  if (photoInput) {
    console.log("Input de foto encontrado, adicionando event listener");
    photoInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        console.log("Arquivo selecionado:", file.name, "Tamanho:", file.size, "bytes");
        if (file.size > 2 * 1024 * 1024) {
          alert("A foto deve ter no máximo 2MB!");
          photoInput.value = ""; // Limpar seleção
          return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
          console.log("Foto carregada, mostrando preview");
          if (profilePhoto) {
            profilePhoto.src = e.target.result;
            profilePhoto.style.display = "block";
            profilePhoto.alt = "Foto de perfil";
            // Remover ícone padrão se existir
            const defaultIcon = profilePhoto.parentElement?.querySelector(".default-avatar-icon");
            if (defaultIcon) {
              defaultIcon.remove();
            }
            console.log("Preview da foto atualizado com sucesso!");
          } else {
            console.error("Elemento .profile-photo não encontrado!");
          }
        };
        reader.onerror = function(error) {
          console.error("Erro ao ler arquivo:", error);
          alert("Erro ao processar a foto. Tente novamente.");
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Nenhum arquivo selecionado");
      }
    });
  } else {
    console.error("Input de foto não encontrado no HTML!");
  }

  // Adicionar event listener ao botão de editar foto
  if (photoEditBtn) {
    console.log("Botão de editar foto encontrado");
    photoEditBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Botão de editar foto clicado");
      const input = document.getElementById("profile-photo-input");
      if (input) {
        console.log("Abrindo seletor de arquivo");
        input.click();
      } else {
        console.error("Input de foto não encontrado!");
        alert("Erro: Input de foto não encontrado. Recarregue a página e tente novamente.");
      }
    });
  } else {
    console.error("Botão de editar foto não encontrado!");
  }

  // Submeter formulário de perfil
  const profileForm = document.querySelector(".profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      await saveUserProfile();
    });
  }
});

