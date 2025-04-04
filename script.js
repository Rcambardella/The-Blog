// === DARK MODE === //
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = document.getElementById('mode');

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  document.documentElement.classList.toggle('dark-mode');

  const isDark = body.classList.contains('dark-mode');
  icon.src = isDark ? 'images/icon-sun.svg' : 'images/icon-moon.svg';
  icon.alt = isDark ? 'Light mode' : 'Dark mode';

  const socialIcons = document.querySelectorAll('.social-btn');

  socialIcons.forEach(socialIcon => {
    const name = socialIcon.dataset.name;
    socialIcon.src = isDark
      ? `images/${name}-white.svg`
      : `images/${name}.svg`;
  });
});

// === HAMBURGER MENU === //
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");

  const icon = menuToggle.querySelector("img");
  if (navLinks.classList.contains("show")) {
    icon.src = "images/icon-menu-close.svg";
  } else {
    icon.src = "images/icon-menu.svg";
  }
});

// === HIGHLIGHT CURRENT NAV LINK === //
const nav = document.querySelectorAll('.nav a');
const currentPath = window.location.pathname;

nav.forEach(link => {
  const linkPath = new URL(link.href).pathname;

  if (linkPath === currentPath) {
    link.classList.add('active');
  }
});

// === LOAD JSON DATA === //

// Helper: Get query string param
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

// Render blog post
async function renderPost() {
  const slug = getSlugFromURL();
  if (!slug) {
    document.getElementById('post-title').textContent = 'Post Not Found';
    return;
  }

  try {
    const response = await fetch('/data.json'); // Adjust path if needed
    const posts = await response.json();

    const post = posts.find(p => p.slug === slug);

    if (!post) {
      document.getElementById('post-title').textContent = 'Post Not Found';
      return;
    }

    // Fill content
    document.getElementById('post-title').textContent = post.title;

    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    document.getElementById('post-date').textContent = "Published " + date;
    const html = marked.parse(post.content);
    document.getElementById('post-content').innerHTML = html;
    Prism.highlightAll();

  } catch (err) {
    console.error('Error loading post:', err);
    document.getElementById('post-title').textContent = 'Error loading post';
  }
}

renderPost();
