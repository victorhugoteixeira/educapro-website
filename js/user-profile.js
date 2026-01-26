// ========== UTILITÁRIO PARA GERENCIAR PERFIL DO USUÁRIO ==========

// Função para obter usuário logado do localStorage
function getLoggedUser() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Erro ao parsear usuário:", e);
      return null;
    }
  }
  return null;
}

// Função para atualizar dados do usuário em todas as páginas
function updateUserProfile() {
  const user = getLoggedUser();
  
  if (!user) {
    console.log("Nenhum usuário logado encontrado");
    return;
  }

  console.log("Atualizando perfil do usuário:", user.name);
  console.log("photoUrl do usuário:", user.photoUrl ? (user.photoUrl.substring(0, 50) + "...") : "null/vazio");

  // Atualizar nome do usuário no título de boas-vindas
  const welcomeTitle = document.querySelector(".welcome-title");
  if (welcomeTitle && user.name) {
    const firstName = user.name.split(" ")[0] || "Usuário";
    welcomeTitle.textContent = `Bem-vindo${firstName.toLowerCase().endsWith("a") ? "a" : ""}, ${firstName}!`;
  }

  // Atualizar avatares (foto do perfil)
  const avatars = document.querySelectorAll(".user-avatar, .avatar-large, .profile-photo");
  console.log("Encontrados", avatars.length, "avatares para atualizar");
  
  avatars.forEach(avatar => {
    // Verificar se tem foto válida
    const hasPhoto = user.photoUrl && 
                     typeof user.photoUrl === "string" &&
                     user.photoUrl.trim() !== "" && 
                     user.photoUrl !== "null" && 
                     user.photoUrl.toLowerCase() !== "null" &&
                     !user.photoUrl.startsWith("img/") && // Não usar imagens padrão
                     (user.photoUrl.startsWith("data:image") || user.photoUrl.startsWith("http")); // Deve ser base64 ou URL
    
    console.log("Avatar:", avatar.className, "| HasPhoto:", hasPhoto);
    
    if (hasPhoto) {
      console.log("Definindo foto do avatar:", user.photoUrl.substring(0, 50) + "...");
      avatar.src = user.photoUrl;
      avatar.style.display = "block";
      avatar.alt = user.name || "Perfil";
      avatar.onerror = function() {
        console.error("Erro ao carregar foto do usuário. URL:", user.photoUrl.substring(0, 100));
        this.style.display = "none";
        showDefaultIcon(avatar);
      };
      avatar.onload = function() {
        console.log("Foto carregada com sucesso!");
      };
      // Remover ícone padrão se existir
      const defaultIcon = avatar.parentElement?.querySelector(".default-avatar-icon");
      if (defaultIcon) {
        defaultIcon.remove();
      }
    } else {
      console.log("Usuário não tem foto válida. photoUrl:", user.photoUrl);
      // Se não tiver foto, mostrar ícone padrão
      avatar.style.display = "none";
      showDefaultIcon(avatar);
    }
  });

  function showDefaultIcon(avatar) {
    const parent = avatar.parentElement;
    if (parent && !parent.querySelector(".default-avatar-icon")) {
      const icon = document.createElement("i");
      icon.className = "ph ph-user default-avatar-icon";
      icon.style.fontSize = avatar.classList.contains("avatar-large") || avatar.classList.contains("profile-photo") ? "4rem" : "1.5rem";
      icon.style.color = "var(--text-white)";
      icon.style.display = "flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.width = avatar.classList.contains("avatar-large") || avatar.classList.contains("profile-photo") ? "120px" : "36px";
      icon.style.height = avatar.classList.contains("avatar-large") || avatar.classList.contains("profile-photo") ? "120px" : "36px";
      icon.style.borderRadius = "50%";
      icon.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      parent.appendChild(icon);
    }
  }

  // Atualizar nome no menu (se houver elementos com data-user-name)
  const userNameElements = document.querySelectorAll("[data-user-name]");
  userNameElements.forEach(el => {
    if (el && user.name) {
      el.textContent = user.name;
    }
  });
}

// Função para fazer logout
function logout() {
  console.log("Fazendo logout...");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  console.log("Dados removidos do localStorage");
  alert("Você foi desconectado com sucesso!");
  window.location.href = "index.html";
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  updateUserProfile();
  
  // Adicionar event listeners aos links de "Sair"
  // Procurar por links que tenham o ícone ph-sign-out ou texto "Sair"
  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach(link => {
    const icon = link.querySelector('i.ph-sign-out');
    const text = link.textContent.trim().toLowerCase();
    
    // Verificar se é realmente o link de logout (tem ícone de sair ou texto "sair")
    if (icon || text.includes('sair')) {
      // Evitar adicionar listener múltiplas vezes
      if (!link.hasAttribute('data-logout-listener')) {
        link.setAttribute('data-logout-listener', 'true');
        link.addEventListener("click", function(e) {
          e.preventDefault();
          logout();
        });
        console.log("Listener de logout adicionado ao link:", link);
      }
    }
  });
});

