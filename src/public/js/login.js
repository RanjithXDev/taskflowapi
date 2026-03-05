document
  .getElementById("loginBtn")
  .addEventListener("click", login);

async function login(){

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const res = await fetch("/api/auth/login",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      email,
      password
    })

  });

  const data = await res.json();

  if(!res.ok){
    document.getElementById("error")
      .innerText = data.message;
    return;
  }

  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  window.location.href="/dashboard";
}