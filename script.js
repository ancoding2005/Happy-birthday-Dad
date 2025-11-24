// ===========================
// INTRO GATE OVERLAY LOGIC
// ===========================

// Get elements
const introOverlay = document.getElementById("intro-overlay");
const introForm = document.getElementById("introForm");
const mainContent = document.getElementById("main-content");
const dateInput = document.getElementById("anniversary");
const dontRememberCheckbox = document.getElementById("dontRemember");
const submitButton = introForm
  ? introForm.querySelector('button[type="submit"]')
  : null;

// Handle "Bố không nhớ" checkbox
if (dontRememberCheckbox && dateInput) {
  dontRememberCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      dateInput.disabled = true;
      dateInput.value = "";
      dateInput.removeAttribute("required");
    } else {
      dateInput.disabled = false;
      dateInput.setAttribute("required", "required");
    }
  });
}

// Function to send data to email via Formspree
const sendToEmail = async (formData) => {
  // Replace YOUR_FORM_ID with your actual Formspree form ID
  const FORMSPREE_URL = "https://formspree.io/f/movzajee";

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    return {
      success: response.ok,
      status: response.status,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error sending form:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to reveal the main content with animation
const revealMainContent = () => {
  const giftBoxContainer = document.getElementById("giftBoxContainer");

  // Trigger the gift box opening animation
  if (giftBoxContainer) {
    giftBoxContainer.classList.add("is-open");
  }

  // Add fade out effect to entire overlay immediately
  introOverlay.style.transition = "opacity 0.8s ease-out";
  introOverlay.style.opacity = "0";

  // Then hide completely and reveal main content
  setTimeout(() => {
    introOverlay.style.display = "none";
    mainContent.classList.remove("hidden");
    mainContent.classList.add("revealed");

    // Trigger music auto-play after gift opens
    const musicButton = document.getElementById("musicToggle");
    const audio = document.getElementById("backgroundMusic");
    if (audio && musicButton) {
      audio
        .play()
        .then(() => {
          musicButton.classList.add("playing");
          musicButton.textContent = "🎶";
        })
        .catch(() => {
          console.log("Auto-play blocked. User can click music button.");
        });
    }
  }, 800);
};

// Function to show success message with better animation
const showSuccessMessage = () => {
  // Create success icon overlay with message
  const successContainer = document.createElement("div");
  successContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 10000;
    animation: successPopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;

  successContainer.innerHTML = `
    <div style="font-size: 6rem; margin-bottom: 10px;">🎉</div>
    <div style="
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      color: #d4af37;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-weight: 700;
    ">Mật khẩu chính xác!</div>
  `;

  // Add keyframe animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes successPopIn {
      0% { 
        transform: translate(-50%, -50%) scale(0) rotate(-180deg); 
        opacity: 0; 
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.2) rotate(10deg); 
        opacity: 1; 
      }
      100% { 
        transform: translate(-50%, -50%) scale(1) rotate(0deg); 
        opacity: 1; 
      }
    }
    @keyframes successFadeOut {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(successContainer);

  // Fade out after showing
  setTimeout(() => {
    successContainer.style.animation = "successFadeOut 0.5s ease-out forwards";
    setTimeout(() => {
      successContainer.remove();
      style.remove();
    }, 500);
  }, 1200);
};

// Function to create enhanced confetti effect
const createConfetti = () => {
  const colors = [
    "#FFD700",
    "#FFA500",
    "#FF69B4",
    "#87CEEB",
    "#98FB98",
    "#d4af37",
    "#c19a2e",
  ];
  const confettiCount = 80; // Increased for more dramatic effect

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    const size = Math.random() * 8 + 6; // Variable sizes
    const startX = 50 + (Math.random() - 0.5) * 30; // Wider spread

    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${startX}%;
      top: 35%;
      opacity: 1;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      transform: rotate(${Math.random() * 360}deg);
      animation: confettiFall ${
        2.5 + Math.random() * 2
      }s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      z-index: 10001;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    `;

    document.body.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => confetti.remove(), 5000);
  }

  // Add enhanced confetti animation
  if (!document.getElementById("confetti-animation")) {
    const confettiStyle = document.createElement("style");
    confettiStyle.id = "confetti-animation";
    confettiStyle.textContent = `
      @keyframes confettiFall {
        0% {
          transform: translateY(0) translateX(0) rotate(0deg) scale(1);
          opacity: 1;
        }
        25% {
          opacity: 1;
        }
        100% {
          transform: 
            translateY(${window.innerHeight + 100}px) 
            translateX(${(Math.random() - 0.5) * 600}px) 
            rotate(${Math.random() * 1080}deg)
            scale(0.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(confettiStyle);
  }
};

// Handle form submission
if (introForm) {
  introForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const favFood = document.getElementById("favFood").value.trim();
    const hateFood = document.getElementById("hateFood").value.trim();
    const anniversary = dateInput.disabled ? "" : dateInput.value;
    const dontRemember = dontRememberCheckbox.checked;

    // Validation
    if (!favFood || !hateFood) {
      alert("Vui lòng điền đầy đủ thông tin! 😊");
      return;
    }

    if (!dontRemember && !anniversary) {
      alert('Vui lòng chọn ngày kỷ niệm hoặc tích "Bố không nhớ"! 💕');
      return;
    }

    // Change button to loading state
    const originalButtonHTML = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span>
      Đang kiểm tra...
    `;
    submitButton.style.cursor = "not-allowed";

    // Add spin animation
    if (!document.getElementById("spin-animation")) {
      const spinStyle = document.createElement("style");
      spinStyle.id = "spin-animation";
      spinStyle.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(spinStyle);
    }

    // Prepare data for email
    const formData = {
      favFood: favFood,
      hateFood: hateFood,
      anniversary: anniversary
        ? new Date(anniversary).toLocaleDateString("vi-VN")
        : "Bố không nhớ",
      dontRemember: dontRemember,
      timestamp: new Date().toLocaleString("vi-VN"),
      message: `
🎂 CÂU TRẢ LỜI CỦA BỐ 🎂
=====================================

📅 Ngày gửi: ${new Date().toLocaleString("vi-VN")}

1️⃣ Món ăn bố thích nhất:
   ${favFood}

2️⃣ Món ăn bố ghét nhất:
   ${hateFood}

3️⃣ Ngày kỷ niệm ngày cưới:
   ${
     anniversary
       ? new Date(anniversary).toLocaleDateString("vi-VN")
       : "❌ Bố không nhớ"
   }

=====================================
💝 Gửi với tình yêu thương! 💝
      `,
    };

    // Send to email
    const result = await sendToEmail(formData);

    if (result.success) {
      // Success! Show success message and confetti
      showSuccessMessage();

      // Trigger confetti explosion with slight delay for impact
      setTimeout(() => {
        createConfetti();
      }, 400);

      // Wait for success message, then reveal content with 3D gift opening
      setTimeout(() => {
        revealMainContent();
      }, 1400);
    } else {
      // Failed - but still open the gate (fallback)
      console.error("Failed to send email:", result.error);

      // Show gentle error message
      alert("Có lỗi khi gửi, nhưng không sao! Bố vẫn được xem quà nhé! 🎁💝");

      // Restore button temporarily to show it worked anyway
      submitButton.innerHTML = originalButtonHTML;
      submitButton.disabled = false;
      submitButton.style.cursor = "pointer";

      // Still reveal the content with confetti
      setTimeout(() => {
        createConfetti();
        revealMainContent();
      }, 500);
    }
  });
}

// ===========================
// PARALLAX BACKGROUND EFFECT
// ===========================

// Parallax scroll effect for background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElement =
    document.querySelector("body::before") || document.body;

  // Apply parallax transform to body background
  document.body.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// ===========================
// SVG PATH SCROLL ANIMATION
// ===========================

const animateSVGPath = () => {
  const path = document.getElementById("timelinePath");
  const svg = document.getElementById("timelineSvg");

  if (!path || !svg) return;

  const pathLength = path.getTotalLength();

  // Set initial state
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  const updatePathDrawing = () => {
    // Get scroll position
    const scrollPercentage =
      (window.pageYOffset - svg.offsetTop) /
      (svg.offsetHeight - window.innerHeight);
    const drawLength = pathLength * Math.max(0, Math.min(1, scrollPercentage));

    // Update the path drawing
    path.style.strokeDashoffset = pathLength - drawLength;
  };

  // Update on scroll
  window.addEventListener("scroll", updatePathDrawing);
  updatePathDrawing(); // Initial call
};

// ===========================
// 3D TILT EFFECT ON CARDS
// ===========================

const init3DTiltEffect = () => {
  const tiltCards = document.querySelectorAll("[data-tilt]");

  tiltCards.forEach((card) => {
    const content = card.querySelector(".timeline-content");
    if (!content) return;

    card.addEventListener("mousemove", (e) => {
      const rect = content.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to card center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation angles (max 15 degrees)
      const rotateX = (mouseY / (rect.height / 2)) * -10;
      const rotateY = (mouseX / (rect.width / 2)) * 10;

      // Apply 3D transform
      content.style.transform = `
        perspective(1500px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        translateZ(20px)
      `;

      content.setAttribute("data-tilt-active", "true");
    });

    card.addEventListener("mouseleave", () => {
      // Reset to original position
      content.style.transform = `
        perspective(1500px) 
        rotateX(0deg) 
        rotateY(0deg)
        translateZ(0px)
      `;

      content.setAttribute("data-tilt-active", "false");
    });
  });
};

// ===========================
// 3D FLIP REVEAL ON SCROLL
// ===========================

// IntersectionObserver options
const observerOptions = {
  root: null, // viewport
  threshold: 0.2, // Trigger when 20% of the element is visible
  rootMargin: "0px",
};

// Callback function when elements intersect
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add 'visible' class to trigger the flip animation
      entry.target.classList.add("visible");

      // Optional: Unobserve after animation to improve performance
      // Uncomment the line below if you want the animation to happen only once
      // observer.unobserve(entry.target);
    } else {
      // Optional: Remove 'visible' class when scrolling back up
      // Uncomment the line below if you want the animation to reverse
      // entry.target.classList.remove('visible');
    }
  });
};

// Create the IntersectionObserver instance
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all timeline items
const initScrollAnimations = () => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  timelineItems.forEach((item, index) => {
    // Add a slight staggered delay for each item
    item.style.transitionDelay = `${index * 0.1}s`;

    // Start observing each timeline item
    observer.observe(item);
  });
};

// ===========================
// ENHANCED PARALLAX EFFECTS
// ===========================

// Add parallax effect to timeline images
const initImageParallax = () => {
  const images = document.querySelectorAll(".timeline-image-container");

  window.addEventListener("scroll", () => {
    images.forEach((image) => {
      const rect = image.getBoundingClientRect();
      const scrollPercent = rect.top / window.innerHeight;

      // Apply subtle parallax movement to images
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const movement = (scrollPercent - 0.5) * 20;
        image.style.transform = `translateY(${movement}px) rotate(${
          image.dataset.rotation || 0
        }deg)`;
      }
    });
  });

  // Store initial rotation values
  document
    .querySelectorAll(".timeline-item.left .timeline-image-container")
    .forEach((img) => {
      img.dataset.rotation = "-1";
    });

  document
    .querySelectorAll(".timeline-item.right .timeline-image-container")
    .forEach((img) => {
      img.dataset.rotation = "1";
    });
};

// ===========================
// SMOOTH SCROLL ENHANCEMENT
// ===========================

// Add smooth scrolling to anchor links if any are added later
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

// ===========================
// INITIALIZE ON PAGE LOAD
// ===========================

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initImageParallax();
    animateSVGPath();
    init3DTiltEffect();
  });
} else {
  // DOM is already loaded
  initScrollAnimations();
  initImageParallax();
  animateSVGPath();
  init3DTiltEffect();
}

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Debounce function for scroll events
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll-heavy operations if needed
const optimizedScroll = debounce(() => {
  // Additional scroll operations can be added here
}, 10);

window.addEventListener("scroll", optimizedScroll);

// ===========================
// MUSIC PLAYER FUNCTIONALITY
// ===========================

// Get audio element and music button
const audio = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicToggle");

// Initialize audio state
let isPlaying = false;

// Function to toggle music play/pause
const toggleMusic = () => {
  if (isPlaying) {
    audio.pause();
    musicButton.classList.remove("playing");
    musicButton.textContent = "🎵";
    isPlaying = false;
  } else {
    // Attempt to play the audio
    audio
      .play()
      .then(() => {
        musicButton.classList.add("playing");
        musicButton.textContent = "🎶";
        isPlaying = true;
      })
      .catch((error) => {
        console.log("Audio playback failed:", error);
        // Show a friendly message if autoplay is blocked
        alert("Please click the music button to enable background music! 🎵");
      });
  }
};

// Add click event listener to music button
if (musicButton && audio) {
  musicButton.addEventListener("click", toggleMusic);

  // Handle audio end event (though loop is set, good to have)
  audio.addEventListener("ended", () => {
    if (isPlaying) {
      audio.play();
    }
  });
}

// ===========================
// HEADER INTRO ANIMATION
// ===========================

// Header animation is now handled by CSS animation
// The CSS animation will run automatically on page load
// This ensures smoother performance than JavaScript-based animation
