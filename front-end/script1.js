// Partie 1 : Effets visuels de fête (confettis et ballons)
document.addEventListener('DOMContentLoaded', function() {
    const partyBtn = document.getElementById('partyBtn');
    const footer = document.querySelector('.footer');
    const partyColors = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF',
        '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40']

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        const size = Math.random() * 10 + 5;
        const color = partyColors[Math.floor(Math.random() * partyColors.length)];
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;

        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${animationDuration}s`;
        if (Math.random() > 0.5) confetti.style.borderRadius = '50%';
        else confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        footer.appendChild(confetti);
        setTimeout(() => confetti.remove(), animationDuration * 1000);
    }

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const size = Math.random() * 30 + 20;
        const color = partyColors[Math.floor(Math.random() * partyColors.length)];
        const left = Math.random() * 100;

        balloon.style.width = `${size}px`;
        balloon.style.height = `${size + size/2}px`;
        balloon.style.backgroundColor = color;
        balloon.style.left = `${left}%`;
        balloon.style.bottom = '-50px';
        balloon.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';

        footer.appendChild(balloon);
        setTimeout(() => {
            balloon.style.transition = 'all 4s ease-in';
            balloon.style.bottom = '100%';
            balloon.style.opacity = '0';
        }, 10);
        setTimeout(() => balloon.remove(), 4100);
    }

    partyBtn?.addEventListener('click', function() {
        this.classList.add('party-active');
        const partyInterval = setInterval(createConfetti, 50);
        let colorIndex = 0;
        const colorInterval = setInterval(() => {
            footer.style.backgroundColor = partyColors[colorIndex];
            colorIndex = (colorIndex + 1) % partyColors.length;
        }, 300);
        setTimeout(() => {
            clearInterval(partyInterval);
            clearInterval(colorInterval);
            footer.style.backgroundColor = '';
            this.classList.remove('party-active');
        }, 3000);
    });

    partyBtn?.addEventListener('mouseenter', () => {
        for (let i = 0; i < 5; i++) setTimeout(createBalloon, i * 200);
    });
});

// Partie 2 : Login + enregistrement avec fetch vers backend

document.addEventListener('DOMContentLoaded', function () {
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('strengthMeter');
    const capsWarning = document.getElementById('capsWarning');
    const eyeIcon = togglePassword?.querySelector('i');
    const userRoleSelect = document.getElementById('userRole');

    togglePassword?.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon?.classList.toggle('fa-eye');
        eyeIcon?.classList.toggle('fa-eye-slash');
    });

    passwordInput?.addEventListener('keyup', function (e) {
        capsWarning.style.display = e.getModifierState('CapsLock') ? 'block' : 'none';
    });

    passwordInput?.addEventListener('input', function () {
        const password = this.value;
        let strength = 0;
        if (password.length > 7) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;

        strengthMeter.className = 'strength-meter';
        if (password.length > 0) {
            strengthMeter.classList.add(strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong');
        }
    });

    userRoleSelect?.addEventListener('change', function () {
        const usernameField = document.getElementById('username');
        usernameField.placeholder = this.value === 'teacher' ? "Enter your institutional email" : "Enter your student ID or email";
    });

    
  registerBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        role: document.getElementById("userRole").value,
        sexe: document.getElementById("gender").value,
        dateNaissance: document.getElementById("birthDate").value,
        etablissement: document.getElementById("institution").value,
        course: document.getElementById("field").value,
      };
      try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        const response = await res.json();
        if (!res.ok) throw new Error(response.message);
        alert("✅ Inscription réussie !");
      } catch (err) {
        alert("❌ " + err.message);
      }
    });
  
    loginBtn.addEventListener("click", async function (e) {
      e.preventDefault();
  
      const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        role: document.getElementById("userRole").value,
      };
  
      try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        const response = await res.json();
        if (!res.ok) throw new Error(response.message);

        if (response.token) {
            localStorage.setItem("token", response.token);
        }
  
        alert("✅ Connexion réussie !");
        if (data.role === "teacher") window.location.href = "teacher.html";
        else if (data.role === "student") window.location.href = "student.html";
  
      } catch (err) {
        alert("❌ " + err.message);
      }
    });
  });
            

    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            const formGroup = this.closest('.form-group');
            formGroup.querySelector('label').style.color = 'var(--primary)';
            if (formGroup.querySelector('.icon')) {
                formGroup.querySelector('.icon').style.color = 'var(--primary)';
            }
        });
        input.addEventListener('blur', function () {
            const formGroup = this.closest('.form-group');
            formGroup.querySelector('label').style.color = 'var(--primary)';
            if (formGroup.querySelector('.icon')) {
                formGroup.querySelector('.icon').style.color = 'var(--text-light)';
            }
        });
    });


// Partie 3 : Animation des cartes (slider)
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById('cardSlider');
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
});
