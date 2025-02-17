import { showAlert } from "./alert";

export function authGuard() {
  if (!localStorage.token) {
    
    showAlert("You must be logged in to view this page", "warning", 5000); 

    setTimeout(() => {
      window.location.href = "/auth/login/";
    }, 5000); 
  }
}
