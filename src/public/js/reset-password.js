document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("resetBtn");

  btn.addEventListener("click", resetPassword);

});

async function resetPassword() {

  const password = document.getElementById("password").value;

  const token =
    window.location.pathname.split("/").pop();

  try {

    const res = await fetch(`/api/auth/reset-password/${token}`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({ password })

    });

    const data = await res.json();

    document.getElementById("message").innerText =
      data.message;

  } catch (err) {

    console.error(err);
    alert("Reset failed");

  }

}