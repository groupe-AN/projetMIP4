const slider = document.getElementById('cardSlider');
  const cards = document.querySelectorAll('.card');

  const cardWidth = cards[0].offsetWidth + 20;
  const totalCards = cards.length;
  const visibleCards = Math.floor(slider.offsetWidth / cardWidth);

  let currentIndex = 0;

  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.2
    });

    cards.forEach(card => {
      observer.observe(card);
    });
  });

  nextBtn.addEventListener('click', () => {
    if ((currentIndex + 1) * visibleCards < totalCards) {
      currentIndex++;
      slider.scrollBy({ left: cardWidth * visibleCards, behavior: 'smooth' });
      updateDots();
    }
  });
