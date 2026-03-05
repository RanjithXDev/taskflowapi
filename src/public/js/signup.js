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

  const res = await fetch("/api/auth/signup",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      name,
      email,
      password,
      role
    })

  });

  const data = await res.json();

  if(!res.ok){
    document.getElementById("error")
      .innerText = data.message;
    return;
  }

  localStorage.setItem("token", data.token);

  window.location.href="/login";
}