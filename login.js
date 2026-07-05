const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  
  try {
    
    const response = await fetch("/login", {
      
      method: "POST",
      
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({
        username,
        password
      })
      
    });
    
    const data = await response.json();
    
    if (data.success) {
      
      window.location.href = "/index.html";
      
    } else {
      
      message.textContent = data.message;
      
    }
    
  } catch (err) {
    
    message.textContent = "Unable to connect to server.";
    
  }
  
});