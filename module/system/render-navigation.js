import { showGMDashboard } from "../applications/gm-dashboard.js";

export const renderNavigation = async () => {

  if (document.querySelector(".mythic-bastionland.ui-control.gm-dashboard")) {
    // If the buttons already exist, do not add them again  
    return;
  }

  const sceneNavigation = document.querySelector("#ui-left-column-2");
  
  if (game.user.isGM) {
    const navElement = document.createElement("nav");
    navElement.classList.add("flexcol","gm-dashboard-nav-item");

    const button = document.createElement("a");       
    button.classList.add("mythic-bastionland", "ui-control", "gm-dashboard");      
    button.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("MB.Dashboard.Label")} `;
    button.style.width = "100%"; // Ensure the button takes full width, some css would be great but don't understand at present the new scene navigation system and it's styles

    sceneNavigation.prepend(navElement);
    navElement.append(button);

    button.addEventListener("click", () => {
      showGMDashboard();
    });
  }
};
