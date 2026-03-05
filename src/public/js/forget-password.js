document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("forgotBtn");

  btn.addEventListener("click", sendResetLink);

});

async function sendResetLink() {

  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter email");
    return;
  }

  try {

    const res = await fetch("/api/auth/forgot-password", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({ email })

    });

    const data = await res.json();

    document.getElementById("message").innerText =
      "Reset link generated: " + data.resetLink;

  } catch (err) {

    console.error(err);
    alert("Failed to send reset link");

  }

}