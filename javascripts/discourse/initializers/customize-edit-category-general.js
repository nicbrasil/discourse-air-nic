import { cancel } from "@ember/runloop";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "customize-edit-category-general",

  initialize() {
    withPluginApi("0.8.14", (api) => {
      api.onPageChange((url) => {
        if (url === "/login") {
          // Aguarda o DOM estar pronto para manipulação
          requestAnimationFrame(() => {
            const loginBody = document.querySelector(".login-body");
            const loginForm = document.querySelector("#login-form");

            // Evita duplicar elementos se já foram inseridos
            if (loginBody) {
              const titulo = document.createElement("h1");
              titulo.className = "login-title";
              titulo.textContent = "Comunidade Fib";
              loginBody.parentNode.insertBefore(titulo, loginBody);
            }

            if (!document.querySelector(".subtitulo-destaque") && loginBody) {
              const subTitulo = document.createElement("span");
              subTitulo.classList.add("subtitulo-destaque");
              subTitulo.innerHTML = 'Acesse via <span>Cursos e Eventos</span>';
              loginBody.parentNode.insertBefore(subTitulo, loginBody);
            }

            if (loginForm && loginForm.parentElement) {
              const container = loginForm.parentElement;

              const button = document.querySelector(".login-page-cta")

              const tituloAuthDiscourse = document.createElement("button");
              tituloAuthDiscourse.className = "login-discourse-title";
              tituloAuthDiscourse.innerHTML =
                'Ou faça login pelo Discourse <span class="arrow-btn">&rsaquo;</span>';

              container.parentNode.insertBefore(tituloAuthDiscourse, container);

              container.classList.add("hidden");
              button.classList.add("hidden");

              const arrowButton = tituloAuthDiscourse.querySelector(".arrow-btn");
              tituloAuthDiscourse.addEventListener("click", () => {
                arrowButton.classList.toggle("rotated");
                container.classList.toggle("hidden");
                button.classList.toggle("hidden");
              });
            }

          });
        }
      });

      api.modifyClass("component:edit-category-general", {
        pluginId: "discourse-air",

        didInsertElement() {
          this._super(...arguments);
          document.body.classList.add("edit-category");
          this._focusCategoryName();
        },

        willDestroyElement() {
          this._super(...arguments);
          document.body.classList.remove("edit-category");
          this._laterFocus && cancel(this._laterFocus);
        },
      });
    });
  },
};
