// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Enhanced Floating Particles - 50 particles (up & down movement)
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random animation duration and delay
    const duration = 15 + Math.random() * 15; // 15-30 seconds
    const delay = Math.random() * 10; // 0-10 seconds delay
    
    // Random horizontal drift while moving vertically
    const driftX = (Math.random() - 0.5) * 100; // -50 to 50px horizontal drift
    particle.style.setProperty('--drift-x', driftX + 'px');
    
    // Randomly choose: 50% up, 50% down
    if (Math.random() > 0.5) {
        // Move from bottom to top
        particle.style.top = '100vh'; // Start from bottom
        particle.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
    } else {
        // Move from top to bottom
        particle.style.top = '-10px'; // Start from top
        particle.style.animation = `floatDown ${duration}s linear ${delay}s infinite`;
    }
    
    particlesContainer.appendChild(particle);
}

// 3D Floating Icons with Parallax Effect
const floatingIconsContainer = document.getElementById('floatingIcons');
const icons = [
    { icon: 'fa-tshirt', top: '15%', left: '10%', delay: 0 },
    { icon: 'fa-hat-cowboy', top: '25%', left: '85%', delay: 2 },
    { icon: 'fa-glasses', top: '45%', left: '8%', delay: 4 },
    { icon: 'fa-shoe-prints', top: '60%', left: '90%', delay: 1 },
    { icon: 'fa-gem', top: '75%', left: '12%', delay: 3 },
    { icon: 'fa-crown', top: '80%', left: '88%', delay: 5 }
];

icons.forEach(iconData => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'floating-icon';
    iconDiv.innerHTML = `<i class="fas ${iconData.icon}"></i>`;
    iconDiv.style.top = iconData.top;
    iconDiv.style.left = iconData.left;
    iconDiv.style.animationDelay = iconData.delay + 's';
    floatingIconsContainer.appendChild(iconDiv);
});

// Parallax Mouse Effect for Icons
document.addEventListener('mousemove', (e) => {
    const icons = document.querySelectorAll('.floating-icon');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    icons.forEach((icon, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Animated Stats Counter
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString() + (target === 99 ? '' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + (target === 99 ? '' : '+');
        }
    };

    updateCounter();
};

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (stat.textContent === '0') {
                    animateCounter(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}
