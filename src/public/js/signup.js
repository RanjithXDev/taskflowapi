document
  .getElementById("signupBtn")
  .addEventListener("click", signup);

async function signup(){

  const name =
    document.getElementById("name").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const role =
    document.getElementById("role").value;

  const avatarInput =
    document.getElementById("avatarFile");

  const avatarFile =
    avatarInput && avatarInput.files.length > 0
      ? avatarInput.files[0]
      : null;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", role);

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const res = await fetch("/api/auth/signup", {

    method: "POST",

    body: formData

  });

  const data = await res.json();

  if (!res.ok) {
    document
      .getElementById("error")
      .innerText = data.message;
    return;
  }

  localStorage.setItem("token", data.token);

  window.location.href = "/login";
}