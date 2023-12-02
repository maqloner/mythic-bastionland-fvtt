import { showGMDashboard } from "../app/gm-dashboard.js";

export const renderNavigation = async (html) => {
  if (game.user.isGM) {
    const button = document.createElement("a");             
    $(button).addClass('mythic-bastionland nav-item gm-dashboard')
    $(button).html(`<i class="fas fa-dice-d20"></i> ${game.i18n.localize("MB.Dashboard")} `);

    html.prepend(button);

    button.addEventListener("click", () => {
      showGMDashboard();
    });
  }
};
