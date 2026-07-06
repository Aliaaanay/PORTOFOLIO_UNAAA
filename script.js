document.addEventListener("DOMContentLoaded", () => {
  // Ambil root element (HTML)
  const html = document.documentElement;

  // ----------------------------------------------------
  // 0. PRE-LOADER & INITIALIZATION
  // ----------------------------------------------------
  const loadingOverlay = document.getElementById("loading-overlay");

  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 500); // Hide after 0.5 second
  }

  // Aktifkan Typewriter (Hanya di halaman Beranda)
  const typewriterElement = document.querySelector(".typewriter-text");
  if (typewriterElement) {
    // Memulai Typewriter hanya setelah loading
    setTimeout(() => {
      startTypewriter(typewriterElement);
    }, 600);
  }

  // Aktifkan Dynamic Quote (Hanya di halaman Tentang Saya)
  const dynamicQuoteElement = document.getElementById("dynamic-quote");
  if (dynamicQuoteElement) {
    startDynamicQuote(dynamicQuoteElement);
  }

  // ----------------------------------------------------
  // 1. NAVIGATION & DARK MODE
  // ----------------------------------------------------

  // --- Dark Mode Elements ---
  const toggleDesktop = document.getElementById("toggle-dark-mode-desktop");
  const toggleMobile = document.getElementById("toggle-dark-mode-mobile");
  const themeToggleButton = document.getElementById("theme-toggle");

  const setDarkMode = (isDark) => {
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Sinkronisasi status checked pada semua toggle yang ada
    if (toggleDesktop) toggleDesktop.checked = isDark;
    if (toggleMobile) toggleMobile.checked = isDark;
  };

  // Initial theme load
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

  if (savedTheme) {
    setDarkMode(savedTheme === "dark");
  } else {
    setDarkMode(prefersDarkMode.matches);
  }

  // Event Listeners untuk Dark Mode
  if (toggleDesktop) {
    toggleDesktop.addEventListener("change", (e) => {
      setDarkMode(e.target.checked);
    });
  }
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      setDarkMode(!html.classList.contains("dark"));
    });
  }
  if (toggleMobile) {
    toggleMobile.addEventListener("change", (e) => {
      setDarkMode(e.target.checked);
    });
  }

  // --- Mobile Menu Modal (Sesuai Contoh) ---
  const menuToggle = document.getElementById("menu-toggle");
  const mainMenuModal = document.getElementById("main-menu-modal");
  const mobileCloseBtn = document.getElementById("mobile-close-btn");

  const toggleMenu = (open) => {
    if (mainMenuModal) {
      if (open) {
        mainMenuModal.classList.add("active");
        mainMenuModal.classList.remove("opacity-0", "pointer-events-none");
        document.body.style.overflowY = "hidden";
      } else {
        mainMenuModal.classList.remove("active");
        mainMenuModal.classList.add("opacity-0", "pointer-events-none");
        document.body.style.overflowY = "auto";
      }
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", open);
      }
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainMenuModal.classList.contains("active");
      toggleMenu(!isOpen);
    });
  }

  // Tombol tutup (X)
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", () => {
      toggleMenu(false);
    });
  }

  // Menutup menu saat link diklik dan saat klik di luar konten
  if (mainMenuModal) {
    mainMenuModal.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu(false);
      });
    });
    mainMenuModal.addEventListener("click", (e) => {
      if (e.target === mainMenuModal) {
        toggleMenu(false);
      }
    });
  }

  // ----------------------------------------------------
  // 2. ANIMATIONS & EFFECTS
  // ----------------------------------------------------

  // Typewriter Effect Function (Logic Ditambahkan)
  function startTypewriter(element) {
    const textArray = element.getAttribute("data-text").split(" • ");
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
      const currentText = textArray[textIndex];

      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30; // Kecepatan menghapus
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70; // Kecepatan mengetik
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000; // Pause di akhir kata
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typingSpeed = 500; // Pause sebelum kata baru
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // Dynamic Quote Logic (Untuk Tentang.html)
  const quotes = [
    '"Saya percaya desain terbaik adalah yang terasa seperti sihir, bukan teknologi."',
    '"Menciptakan antarmuka yang intuitif adalah seni menerjemahkan kompleksitas."',
    '"Setiap piksel dioptimalkan, setiap fungsi dikerjakan dengan hati."',
    '"Visi saya: Jembatan antara Kreativitas dan Kode yang Efisien."',
  ];
  let currentQuoteIndex = 0;

  function startDynamicQuote(element) {
    if (!element) return;

    const changeQuote = () => {
      element.style.opacity = "0";
      setTimeout(() => {
        element.textContent = quotes[currentQuoteIndex];
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        element.style.opacity = "1";
      }, 500);
    };

    changeQuote();
    setInterval(changeQuote, 5000);
  }

  // Scroll Reveal (Mempertahankan logic)
  const scrollRevealElements = document.querySelectorAll(
    "[data-scroll-reveal]",
  );
  if (scrollRevealElements.length > 0) {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const childrenToStagger = entry.target.querySelectorAll(
            "[data-scroll-reveal-child]",
          );
          if (childrenToStagger.length > 0) {
            childrenToStagger.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("visible");
                child.style.opacity = "1";
                child.style.transform = "scale(1)";

                if (child.classList.contains("skill-hexagon")) {
                  const level = child.getAttribute("data-skill-level");
                  const overlay = child.querySelector(".skill-level-overlay");
                  if (overlay) {
                    overlay.style.height = level + "%";
                  }
                }
              }, index * 100);
            });
          }

          entry.target.classList.add("visible");
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollRevealElements.forEach((el) => {
      observer.observe(el);
    });
  }

  // ----------------------------------------------------
  // 3. PORTOFOLIO LOGIC (Filter, Modal, Tilt, Load More) 📐
  // ----------------------------------------------------

  // Mouse Tilt Effect
  const projectCards = document.querySelectorAll(".project-card-custom");

  if (projectCards.length > 0) {
    projectCards.forEach((card) => {
      const handleMouseMove = (e) => {
        if (window.innerWidth <= 1024) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tiltFactor = 5;

        const rotateX = ((y - rect.height / 2) / rect.height) * tiltFactor;
        const rotateY = ((x - rect.width / 2) / card.width) * -tiltFactor;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      };

      const handleMouseLeave = () => {
        if (window.innerWidth <= 1024) return;

        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        card.style.boxShadow = "";
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  // Testimonial Carousel (Simplified logic)
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  const showTestimonial = (index) => {
    testimonials.forEach((card, i) => {
      card.classList.remove("active", "opacity-100", "pointer-events-auto");
      card.classList.add("opacity-0", "pointer-events-none");

      if (i === index) {
        card.classList.add("active", "opacity-100", "pointer-events-auto");
        card.style.transitionDelay = "0s";
      }
    });
  };

  if (testimonials.length > 0) {
    showTestimonial(currentTestimonial);

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentTestimonial =
          (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
      });
    }
  }

  // Data dummy untuk detail proyek (DIUBAH UNTUK PLACEHOLDER)
  const projectDetails = {
    1: {
      title: "Proyek Pembelajaran HTML, CSS, dan JavaScript",
      category: "Pengembangan Web | Html, CSS, JavaScript",
      image: "img/Project_1.png",
      description:
        "Mengembangkan pembelajaran HTML, CSS, dan JavaScript dengan fokus pada penggunaan teknologi modern dan praktik terbaik.",
      challenge:
        "Memastikan Pembelajaran HTML, CSS, dan JavaScript berjalan dengan baik di berbagai browser.",
      solution:
        "Implementasi teknik cross-browser compatibility dan penggunaan CSS polyfills.",
      repo: "https://github.com/Aliaaanay/05TPLP017_UAS_PROJECT_KELOMPOK_11",
    },
    2: {
      title: "Membuat Game Flappy Bird Sederhana",
      category: "Game & Java",
      image: "img/gameflappybird.png",
      description:
        "Membuat game Flappy Bird sederhana menggunakan teknologi modern.",
      challenge:
        "Menghadapi tantangan dalam mengoptimalkan kinerja game di perangkat mobile.",
      solution:
        "game loop yang efisien dan penggunaan canvas untuk rendering grafis.",
      repo: "https://github.com/Aliaaanay/Project-Flappy-Bird",
    },
    3: {
      title: "Aplikasi SMART STUDENT ASSISTANT",
      category: "Mobile | Java",
      image: "img/smartstudent.jpeg",
      description:
        "Aplikasi mobile untuk membantu siswa mengelola jadwal, tugas, dan informasi akademik mereka.",
      challenge:
        "Membuat aplikasi mobile yang responsif dan efisien dalam mengelola data akademik siswa.",
      solution:
        "aplikasi mobile menggunakan Java dengan desain *dark mode* yang berpusat pada data pengguna.",
      repo: "https://github.com/Aliaaanay/SMARTSTUDENTASSISTANT",
    },
    4: {
      title: "Website Penjualan aplikasi Premium",
      category: "Web & Branding",
      image: "img/websiteapp_prem.png",
      description:
        "Pembuatan landing page untuk penjualan aplikasi premium dengan desain responsif dan optimasi SEO.",
      challenge:
        "Mengoptimalkan performa website agar cepat diakses dan ramah SEO.",
      solution:
        "website aplikasi premium menggunakan HTML5, CSS3, dan JavaScript modern dengan optimasi gambar dan minifikasi file.",
      repo: "https://github.com/Aliaaanay/website_zullstore",
    },
  };

  // Modal Box Logic (Diperbarui untuk Image/Video)
  const modal = document.getElementById("projectModal");
  const closeBtn = document.querySelector(".modal .close-btn");
  const detailButtons = document.querySelectorAll(".details-btn");

  if (modal) {
    const openModal = (data) => {
      document.getElementById("modal-project-title").textContent = data.title;
      document.getElementById("modal-project-category").textContent =
        data.category;
      document.getElementById("modal-project-description").textContent =
        data.description;

      document.getElementById("modal-project-challenge").innerHTML =
        `<strong>Tantangan Utama:</strong> ${data.challenge}`;
      document.getElementById("modal-project-solution").innerHTML =
        `<strong>Solusi:</strong> ${data.solution}`;

      const imgElement = document.getElementById("modal-project-img");
      const videoElement = document.getElementById("modal-project-video"); // Elemen video (jika ada)

      // Cek apakah URL adalah video (misalnya .mp4, .webm)
      if (data.image.toLowerCase().match(/\.(mp4|webm|ogg)$/)) {
        if (videoElement) {
          videoElement.src = data.image;
          videoElement.classList.remove("hidden");
        }
        if (imgElement) imgElement.classList.add("hidden");
      } else {
        if (imgElement) {
          imgElement.src = data.image;
          imgElement.alt = `Gambar detail proyek ${data.title}`;
          imgElement.classList.remove("hidden");
        }
        if (videoElement) videoElement.classList.add("hidden");
      }

      const demoLink = document.getElementById("modal-link-demo");
      const repoLink = document.getElementById("modal-link-repo");

      if (data.demo && data.demo !== "#") {
        demoLink.href = data.demo;
        demoLink.classList.remove("hidden");
      } else {
        demoLink.href = "#";
        demoLink.classList.add("hidden");
      }
      repoLink.href = data.repo;

      modal.classList.remove("hidden"); // Tampilkan modal
      document.body.style.overflow = "hidden";
      
      // --- TAMBAHAN BARU: Pastikan scroll di dalam modal kembali ke atas ---
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) modalContent.scrollTop = 0;
      // ---------------------------------------------------------------------
    };

    detailButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-project");
        const data = projectDetails[projectId];

        if (data) {
          openModal(data);
        }
      });
    });

    const closeModal = () => {
      modal.classList.add("hidden"); // Sembunyikan modal
      document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  // Filter & Load More Logic
  const filterButtons = document.querySelectorAll(".filter-btn");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (filterButtons.length > 0 && loadMoreBtn) {
    const projectsPerPage = 4;
    const allProjects = Array.from(document.querySelectorAll(".project-card"));

    const updateGalleryVisibility = (filterValue) => {
      let filteredProjects = allProjects.filter((card) => {
        const cardCategory = card.getAttribute("data-category");
        return filterValue === "all" || cardCategory === filterValue;
      });

      const totalFiltered = filteredProjects.length;
      let visibleCount = 0;

      allProjects.forEach((card) => {
        card.classList.add("hidden");
        card.classList.remove("opacity-100", "translate-y-0");
      });

      filteredProjects.forEach((card, index) => {
        if (index < projectsPerPage) {
          card.classList.remove("hidden");
          setTimeout(() => {
            card.classList.add("opacity-100", "translate-y-0");
          }, index * 50);
          visibleCount++;
        }
      });

      updateLoadMoreButton(visibleCount, totalFiltered);
    };

    const loadNextBatch = (currentFilter) => {
      const filteredProjects = allProjects.filter((card) => {
        const cardCategory = card.getAttribute("data-category");
        return currentFilter === "all" || cardCategory === currentFilter;
      });

      let projectsVisible = filteredProjects.filter(
        (card) => !card.classList.contains("hidden"),
      ).length;
      let loadedCount = 0;
      let staggerDelay = 0;

      filteredProjects.forEach((card, index) => {
        if (index >= projectsVisible && loadedCount < projectsPerPage) {
          card.classList.remove("hidden");
          setTimeout(() => {
            card.classList.add("opacity-100", "translate-y-0");
          }, staggerDelay);
          loadedCount++;
          staggerDelay += 50;
        }
      });

      projectsVisible += loadedCount;
      updateLoadMoreButton(projectsVisible, filteredProjects.length);
    };

    const updateLoadMoreButton = (visibleCount, totalFiltered) => {
      const hiddenCount = totalFiltered - visibleCount;
      if (hiddenCount > 0) {
        loadMoreBtn.classList.remove("hidden");
        loadMoreBtn.textContent = `Muat Lebih Banyak Proyek (${visibleCount}/${totalFiltered})`;
        loadMoreBtn.disabled = false;
      } else if (totalFiltered > 0) {
        loadMoreBtn.classList.remove("hidden");
        loadMoreBtn.textContent = `Semua Proyek Ditampilkan (${totalFiltered} Proyek)`;
        loadMoreBtn.disabled = true;
      } else {
        loadMoreBtn.classList.add("hidden");
      }
    };

    loadMoreBtn.addEventListener("click", () => {
      const currentFilter = document
        .querySelector(".filter-btn.active")
        .getAttribute("data-filter");
      loadNextBatch(currentFilter);
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => {
          // Hapus kelas aktif/warna primary
          btn.classList.remove(
            "active",
            "bg-primary",
            "text-white",
            "shadow-md",
          );
          // Tambahkan kelas default/hover
          btn.classList.add(
            "text-primary",
            "dark:text-primary-dark-mode",
            "hover:bg-primary",
            "hover:text-white",
            "hover:shadow-md",
          );
          btn.setAttribute("aria-selected", "false");
        });
        // Terapkan kelas aktif pada tombol yang diklik
        button.classList.add("active", "bg-primary", "text-white", "shadow-md");
        button.classList.remove(
          "text-primary",
          "dark:text-primary-dark-mode",
          "hover:bg-primary",
          "hover:text-white",
          "hover:shadow-md",
        );
        button.setAttribute("aria-selected", "true");

        const filterValue = button.getAttribute("data-filter");
        updateGalleryVisibility(filterValue);
        
        // --- TAMBAHAN BARU: Smooth scroll ke bagian galeri saat filter diklik ---
        const gallerySection = document.querySelector(".project-gallery");
        if(gallerySection) {
            // Kita gunakan getBoundingClientRect agar menghitung posisi relatif layar
            // Dikurangi 100 piksel supaya tidak tertutup efek navbar sticky di atas
            const offsetPosition = gallerySection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
        // ------------------------------------------------------------------------
      });
    });

    updateGalleryVisibility("all");
  }

  // ----------------------------------------------------
  // 4. VALIDASI FORMULIR KONTAK (LOGIC DIHAPUS)
  // ----------------------------------------------------
  // Logic untuk form kontak telah dihapus dari sini karena form telah dihapus dari kontak.html.
});