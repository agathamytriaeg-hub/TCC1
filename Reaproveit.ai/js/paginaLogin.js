const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const message =
  document.getElementById("message");

const remember =
  document.getElementById("remember");


// PEGAR CONTAS SALVAS

function getAccounts() {

  return JSON.parse(
    localStorage.getItem("reaproveita_accounts") || "[]"
  );

}


// SALVAR CONTAS

function saveAccounts(accounts) {

  localStorage.setItem(
    "reaproveita_accounts",
    JSON.stringify(accounts)
  );

}


// MENSAGEM

function showMessage(text, success = false) {

  message.textContent = text;

  message.style.color =
    success ? "#465c1d" : "#9a3535";

}


// MOSTRAR / ESCONDER SENHA

document
  .getElementById("togglePassword")
  .addEventListener("click", () => {

    if (passwordInput.type === "password") {

      passwordInput.type = "text";

    } else {

      passwordInput.type = "password";

    }

  });


// LOGIN

loginForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const email =
    emailInput.value.trim().toLowerCase();

  const password =
    passwordInput.value;


  const accounts = getAccounts();


  const account = accounts.find(
    user =>
      user.email === email &&
      user.password === password
  );


  if (!account) {

    showMessage(
      "E-mail ou senha incorretos."
    );

    return;
  }


  const session = {

    email: account.email,

    loggedAt:
      new Date().toISOString()

  };


  if (remember.checked) {

    localStorage.setItem(
      "reaproveita_session",
      JSON.stringify(session)
    );

  } else {

    sessionStorage.setItem(
      "reaproveita_session",
      JSON.stringify(session)
    );

  }


  showMessage(
    "Login realizado! Entrando...",
    true
  );


  // Página para onde o usuário vai depois do login

  setTimeout(() => {

    window.location.href = "home.html";

  }, 700);

});


// -----------------------------
// CRIAR CONTA
// -----------------------------

const signupModal =
  document.getElementById("signupModal");

const signupForm =
  document.getElementById("signupForm");

const signupMessage =
  document.getElementById("signupMessage");


document
  .getElementById("openSignup")
  .addEventListener("click", () => {

    signupModal.classList.remove("hidden");

  });


document
  .getElementById("closeSignup")
  .addEventListener("click", () => {

    signupModal.classList.add("hidden");

  });


// CRIAR CONTA

signupForm.addEventListener("submit", (event) => {

  event.preventDefault();


  const email =
    document
      .getElementById("signupEmail")
      .value
      .trim()
      .toLowerCase();


  const password =
    document
      .getElementById("signupPassword")
      .value;


  const accounts = getAccounts();


  // Verificar se já existe

  if (
    accounts.some(
      user => user.email === email
    )
  ) {

    signupMessage.textContent =
      "Esse e-mail já está cadastrado.";

    signupMessage.style.color =
      "#9a3535";

    return;

  }


  // Criar conta

  accounts.push({

    email: email,

    password: password

  });


  saveAccounts(accounts);


  signupMessage.textContent =
    "Conta criada com sucesso!";

  signupMessage.style.color =
    "#465c1d";


  setTimeout(() => {

    signupModal.classList.add("hidden");

    emailInput.value = email;

    passwordInput.value = "";

    showMessage(
      "Agora digite sua senha para entrar.",
      true
    );

  }, 900);

});


// ESQUECI A SENHA

document
  .getElementById("forgotPassword")
  .addEventListener("click", () => {

    showMessage(
      "A recuperação de senha precisa ser conectada a um sistema de autenticação."
    );

  });


// LEMBRAR LOGIN

const savedSession =
  localStorage.getItem(
    "reaproveita_session"
  ) ||
  sessionStorage.getItem(
    "reaproveita_session"
  );


if (savedSession) {

  try {

    const session =
      JSON.parse(savedSession);

    emailInput.value =
      session.email || "";

    remember.checked =
      Boolean(
        localStorage.getItem(
          "reaproveita_session"
        )
      );

  } catch {

    localStorage.removeItem(
      "reaproveita_session"
    );

    sessionStorage.removeItem(
      "reaproveita_session"
    );

  }

}