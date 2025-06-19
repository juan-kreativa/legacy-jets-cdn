//GSAP------------------------------------------------------------------------

gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

// Track animated elements to prevent re-animation
const animatedElements = new Set();
function createSplitAnimation(element, isHero = false) {
  const splitText = new SplitText(element, {
    type: "lines, words",
    linesClass: "split-line",
    wordsClass: "split-word"
  });

  // Add ready class to show element and set initial state for words
  element.classList.add('split-ready');
  gsap.set(splitText.words, {
    y: 100,
    autoAlpha: 0
  });

  // Create the animation timeline
  const tl = gsap.timeline({
    paused: true
  });

  tl.to(splitText.words, {
    duration: 1,
    y: 0,
    autoAlpha: 1,
    stagger: 0.05,
    ease: "power2.out"
  });

  if (isHero) {
    // For hero elements, play immediately with a slight delay
    tl.delay(0.5).play();
    animatedElements.add(element);
  } else {
    // For other elements, use ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        if (!animatedElements.has(element)) {
          tl.play();
          animatedElements.add(element);
        }
      }
    });
  }

  return { splitText, timeline: tl };
}

// Initialize split text animations
document.addEventListener("DOMContentLoaded", function() {
  // Initialize ScrollSmoother first
  const smoother = ScrollSmoother.create({
    wrapper: ".page-wrapper",
    content: ".main-wrapper",
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
  });

  // Initialize split text after ScrollSmoother
  gsap.delayedCall(0.2, () => {
    const splitElements = document.querySelectorAll(".split");
    
    splitElements.forEach(element => {
      // Check for hero class or if element is in a hero container
      const isHero = element.classList.contains("hero") || 
                     element.closest(".hero") ||
                     element.closest("[class*='hero']");
      
      createSplitAnimation(element, isHero);
    });
    
    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();
  });
});

//END GSAP------------------------------------------------------------------------


//VIDEO HERO SLIDER------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const videos = Array.from(document.querySelectorAll('.hero-video'));
    const nextBtn = document.querySelector('.w-slider-arrow-right');
    const slides = Array.from(document.querySelectorAll('.w-slide'));
    const slider = document.querySelector('.w-slider');
    const dots = Array.from(document.querySelectorAll('.w-slider-dot'));
    
    if (!videos.length || !nextBtn || !slider) return;
    
    let isManualNavigation = false;
    
    // CSS has been moved to stylesheet
    
    function goNext(index) {
        if (isManualNavigation) return; // Prevent conflicts during manual navigation
        
        nextBtn.click();
        const nextSlide = slides[(index + 1) % slides.length];
        const video = nextSlide.querySelector('.hero-video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
    }
    
    // Video ended event listeners
    videos.forEach((video, i) => {
        video.addEventListener('ended', () => goNext(i));
    });
    
    // Fix 2: Enhanced manual navigation for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            isManualNavigation = true;
            
            // Pause current video
            const currentActiveIndex = slides.findIndex(sl => sl.classList.contains('w-active'));
            if (currentActiveIndex !== -1 && videos[currentActiveIndex]) {
                videos[currentActiveIndex].pause();
            }
            
            // Wait for Webflow's transition to complete, then start the new video
            setTimeout(() => {
                const newActiveIndex = slides.findIndex(sl => sl.classList.contains('w-active'));
                if (newActiveIndex !== -1 && videos[newActiveIndex]) {
                    videos[newActiveIndex].currentTime = 0;
                    videos[newActiveIndex].play().catch(() => {});
                }
                
                // Re-enable auto navigation after a delay
                setTimeout(() => {
                    isManualNavigation = false;
                }, 1000);
            }, 400); // Webflow's default transition time
        });
    });
    
    // Enhanced arrow button handling
    [nextBtn, document.querySelector('.w-slider-arrow-left')].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                isManualNavigation = true;
                
                // Pause current video
                const currentActiveIndex = slides.findIndex(sl => sl.classList.contains('w-active'));
                if (currentActiveIndex !== -1 && videos[currentActiveIndex]) {
                    videos[currentActiveIndex].pause();
                }
                
                // Wait for transition, then start new video
                setTimeout(() => {
                    const newActiveIndex = slides.findIndex(sl => sl.classList.contains('w-active'));
                    if (newActiveIndex !== -1 && videos[newActiveIndex]) {
                        videos[newActiveIndex].currentTime = 0;
                        videos[newActiveIndex].play().catch(() => {});
                    }
                    
                    // Re-enable auto navigation
                    setTimeout(() => {
                        isManualNavigation = false;
                    }, 1000);
                }, 400);
            });
        }
    });
    
    // Listen for slide transition and ensure first video restarts (your original code)
    slider.addEventListener('slid', () => {
        const activeIndex = slides.findIndex(sl => sl.classList.contains('w-active'));
        if (activeIndex === 0 && !isManualNavigation) {
            const video = videos[0];
            video.currentTime = 0;
            video.play().catch(() => {});
        }
    });
});
//END VIDEO HERO SLIDER------------------------------------------------------------------------