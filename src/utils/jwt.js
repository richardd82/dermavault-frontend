// utils/jwt.js
export const isTokenExpired = (token) => {
    if (!token) return true;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (err) {
      console.error("Error decodificando token:", err);
      return true; // considerarlo inválido
    }
  };
  