// Clean, minimal animations for hero section
document.addEventListener("DOMContentLoaded", function () {
  // Simple typing effect for the hero headline
  const typingElement = document.querySelector(".typing-effect");
  if (typingElement) {
    const text = typingElement.textContent;
    typingElement.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Simple stats counter animation
  const statsElements = document.querySelectorAll("[data-stat]");
  statsElements.forEach((element) => {
    const targetValue = parseInt(element.textContent);
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 30);

    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        element.textContent =
          targetValue +
          (element.textContent.includes("+") ? "+" : "") +
          (element.textContent.includes("%") ? "%" : "");
        clearInterval(counter);
      } else {
        element.textContent =
          currentValue +
          (element.textContent.includes("+") ? "+" : "") +
          (element.textContent.includes("%") ? "%" : "");
      }
    }, 50);
  });

  // Smooth scroll for CTA buttons
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
