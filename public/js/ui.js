(() => {
  const setLoadingState = (button, isLoading, loadingText) => {
    if (!button) return;
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent || "Submit";
    }

    button.disabled = isLoading;
    button.textContent = isLoading
      ? loadingText || "Please wait..."
      : button.dataset.originalText;
  };

  const setStatusMessage = (element, message, type) => {
    if (!element) return;
    element.textContent = message;
    element.className = "form-message";
    if (type) {
      element.classList.add(type);
    }
  };

  const bindLogout = () => {
    const logoutButtons = document.querySelectorAll("[data-logout]");
    logoutButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        })
          .catch(() => null)
          .finally(() => {
            window.location.href = "/login";
          });
      });
    });
  };

  const bindAsyncForm = (form, handler) => {
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector('[type="submit"]');
      const status = form.querySelector("[data-form-status]");
      const loadingText = button?.dataset.loadingText || "Saving...";

      try {
        setLoadingState(button, true, loadingText);
        setStatusMessage(status, "", null);
        await handler({
          form,
          button,
          status,
          setStatusMessage,
          setLoadingState,
        });
      } catch (error) {
        setStatusMessage(
          status,
          error.message || "Something went wrong",
          "error",
        );
      } finally {
        setLoadingState(button, false);
      }
    });
  };

  window.BiteMeUI = {
    setLoadingState,
    setStatusMessage,
    bindAsyncForm,
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindLogout();
  });
})();
