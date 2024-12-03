import path from 'node:path'
import { viteVConsole } from 'vite-plugin-vconsole'

export function createViteVConsole() {
  return viteVConsole({
    entry: [path.resolve('src/main.ts')],
    enabled: true,
    config: {
      maxLogNumber: 1000,
      theme: 'light',
    },
    customHide: `
      (() => {
        window._checkVConsoleVisibility = () => {
          const enabled = localStorage.getItem("vConsole-enabled");
          return enabled !== "true";
        };
        return window._checkVConsoleVisibility();
      })()
    `,
    dynamicConfig: {
      theme: `document.documentElement.classList.contains("dark") ? "dark" : "light"`,
    },
    eventListener: `
      const targetElement = document.querySelector("html");
      const observerOptions = {
        attributes: true,
        attributeFilter: ["class"]
      };

      function handleAttributeChange(mutationsList) {
        for(let mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            console.log('Class attribute changed:', mutation.target.className);
            if (window && window.vConsole) {
              window.vConsole.dynamicChange.value = new Date().getTime();
            }
          }
        }
      }

      const observer = new MutationObserver(handleAttributeChange);
      observer.observe(targetElement, observerOptions);
    `,
  })
}
