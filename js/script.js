async function loadGallery() {
  const response = await fetch('gallery.json');
  return await response.json();
}

function createNav() {
  return `
    <header>
      <nav>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="about.html">About</a></li>
          <li><span style="color:gray">3D Walkthrough (Coming Soon)</span></li>
        </ul>
      </nav>
    </header>`;
}

function createFooter() {
  return `<div class="footer">&copy; 2024 Vector Space Weather Gallery</div>`;
}

async function initHome() {
  const data = await loadGallery();
  const random = data[Math.floor(Math.random() * data.length)];
  const container = document.getElementById('home-container');
  container.innerHTML = `
    <div class="square-image"><img src="${random.image}" alt="${random.title}"></div>
    <h2>${random.title}</h2>
    <p>${random.weather}</p>
    <p>${random.description}</p>`;
}

async function initGallery() {
  const data = await loadGallery();
  const grid = document.querySelector('.gallery-grid');
  data.forEach((item, idx) => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.dataset.index = idx;
    grid.appendChild(img);
  });
  const modal = document.querySelector('.modal');
  const modalContent = modal.querySelector('.modal-content');
  grid.addEventListener('click', e => {
    if(e.target.tagName === 'IMG') {
      const item = data[e.target.dataset.index];
      modalContent.innerHTML = `
        <div class="flip">
          <div class="flip-inner">
            <div class="flip-front">
                <img src="${item.image}" alt="${item.title}" style="max-width:100%;height:auto;">
              <p>${item.description}</p>
              <p>${item.generated_at}</p>
            </div>
            <div class="flip-back">
              <p><strong>Weather Prompt:</strong> ${item.weather_prompt}</p>
              <p><strong>Weather:</strong> ${item.weather}</p>
              <p><strong>Image Prompt:</strong> ${item.image_prompt}</p>
            </div>
          </div>
        </div>`;
      modal.classList.add('active');
    }
  });
  modal.addEventListener('click', () => {
    const flip = modal.querySelector('.flip');
    if(flip.classList.contains('show-back')) {
      modal.classList.remove('active');
      flip.classList.remove('show-back');
    } else {
      flip.classList.add('show-back');
    }
  });
}

function setupLayout(pageInit) {
  document.body.insertAdjacentHTML('afterbegin', createNav());
  document.body.insertAdjacentHTML('beforeend', createFooter());
  if(pageInit) pageInit();
}

window.addEventListener('DOMContentLoaded', () => {
  if(document.body.id === 'home') setupLayout(initHome);
  if(document.body.id === 'gallery') setupLayout(initGallery);
  if(document.body.id === 'about') setupLayout();
});
