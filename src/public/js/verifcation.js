const token = "<%= token %>";

async function verifyEmail(){

  const res = await fetch(`/api/auth/verify-email/${token}`,{
    method:"POST"
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    data.message;

}