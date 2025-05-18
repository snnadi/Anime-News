
document.addEventListener('DOMContentLoaded', () => {
    initDarkModeToggle();
  
    // Home page
    if (document.getElementById('featured-container')) {
      loadFeatured();
      loadPopular();
      if (document.getElementById('ratings-list')) loadRatings();
    }
  
    // News page
    if (document.getElementById('news-container')) initNewsPage();
  
    // Seasonal slider
    if (document.getElementById('seasonal-slider')) initSeasonalSlider();
  
    // Reviews page
    if (document.getElementById('reviews-container')) initReviewPage();
  
    // Help page
    if (document.getElementById('faq-root')) initFAQWidget();
    if (document.getElementById('question-form-root')) initQuestionForm();
  });
  
  // Dark mode toggle
  function initDarkModeToggle() {
    const btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => document.body.classList.toggle('dark'));
  }
  
  // Home: featured news
  async function loadFeatured() {
    const container = document.getElementById('featured-container');
    if (!container) return;
    const items = await fetch('/api/featured').then(r => r.json());
    container.innerHTML = items.map(({ title, link, image }) => `
      <div class="card">
        <a href="${link}" target="_blank" rel="noopener">
          ${image ? `<img src="${image}" alt="${title}">` : ''}
        </a>
        <h4><a href="${link}" target="_blank" rel="noopener">${title}</a></h4>
      </div>
    `).join('');
  }
  
  // Home: popular sidebar
  async function loadPopular() {
    const list = document.getElementById('popular-list');
    if (!list) return;
    const items = await fetch('/api/popular').then(r => r.json());
    list.innerHTML = items.map(({ title, link }) => `
      <li><a class="sidebar-link" href="${link}" target="_blank" rel="noopener">${title}</a></li>
    `).join('');
  }
  
  // Home: top ratings
  async function loadRatings() {
    const list = document.getElementById('ratings-list');
    if (!list) return;
    const { data } = await fetch('https://api.jikan.moe/v4/top/anime?limit=6').then(r => r.json());
    list.innerHTML = data.map(a => `
      <div class="ratings-card">
        <a href="${a.url}" target="_blank" rel="noopener">
          <img src="${a.images.jpg.image_url}" alt="${a.title}">
          <p>${a.title}</p>
        </a>
      </div>
    `).join('');
  }
  
  // News page
  function initNewsPage() {
    const container = document.getElementById('news-container');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let params = new URLSearchParams(window.location.search);
    let searchTerm = params.get('q') || '';
    let page = parseInt(params.get('page'), 10) || 1;
  
    searchInput.value = searchTerm;
    searchForm.addEventListener('submit', e => {
      e.preventDefault(); searchTerm = searchInput.value.trim(); page = 1; updateURL(); renderNews();
    });
    prevBtn.addEventListener('click', () => { if (page>1) { page--; updateURL(); renderNews(); }});
    nextBtn.addEventListener('click', () => { page++; updateURL(); renderNews(); });
  
    function updateURL() {
      const u = new URL(window.location);
      u.searchParams.set('page', page);
      if (searchTerm) u.searchParams.set('q', searchTerm);
      history.replaceState(null, '', u);
    }
  
    async function renderNews() {
      const { items, total } = await fetch(`/api/news?q=${encodeURIComponent(searchTerm)}&page=${page}`).then(r => r.json());
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= total;
      container.innerHTML = items.map(({ title, link, image, pubDate }) => `
        <article class="card">
          ${image ? `<img src="${image}" alt="${title}">` : ''}
          <h4>${title}</h4>
          <p class="meta">${new Date(pubDate).toLocaleDateString()}</p>
          <a href="${link}" target="_blank" rel="noopener">Read more →</a>
        </article>
      `).join('');
    }
  
    renderNews();
  }
  
  // Seasonal slider
  async function initSeasonalSlider() {
    const container = document.getElementById('seasonal-slider');
    if (!container) return;
    const data = await fetch('/api/seasonal').then(r => r.json());
    container.innerHTML = data.map((anime,i) => `
      <div class="slide${i===0?' active':''}">
        <a href="${anime.url}" target="_blank" rel="noopener">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        </a>
        <h4><a href="${anime.url}" target="_blank" rel="noopener">${anime.title}</a></h4>
      </div>
    `).join('');
    let idx=0, slides=container.querySelectorAll('.slide');
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx=(idx+1)%slides.length;
      slides[idx].classList.add('active');
    },10000);
  }
  
  // Reviews page
  function initReviewPage() {
    const container = document.getElementById('reviews-container');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let params = new URLSearchParams(window.location.search);
    let searchTerm = params.get('q') || '';
    let page = parseInt(params.get('page'),10) || 1;
  
    searchInput.value = searchTerm;
    searchForm.addEventListener('submit', e => { e.preventDefault(); searchTerm=searchInput.value.trim(); page=1; updateURL(); renderReviews(); });
    prevBtn.addEventListener('click', ()=>{ if(page>1){page--; updateURL(); renderReviews();}});
    nextBtn.addEventListener('click', ()=>{ page++; updateURL(); renderReviews(); });
  
    function updateURL() {
      const u = new URL(window.location);
      u.searchParams.set('page', page);
      if(searchTerm) u.searchParams.set('q', searchTerm);
      history.replaceState(null, '', u);
    }
  
    async function renderReviews() {
      const { items, total } = await fetch(`/api/reviews?q=${encodeURIComponent(searchTerm)}&page=${page}`).then(r => r.json());
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= total;
      container.innerHTML = items.map(({ title, link, image, pubDate }) => `
        <article class="card">
          ${image ? `<img src="${image}" alt="${title}">` : ''}
          <h4>${title}</h4>
          <p class="meta">${new Date(pubDate).toLocaleDateString()}</p>
          <a href="${link}" target="_blank" rel="noopener">Read more →</a>
        </article>
      `).join('');
    }
  
    renderReviews();
  }
  
  // FAQ widget (Help page)
  function initFAQWidget() {
    const { useState } = React;
  
    function FAQItem({ q,a }) {
      const [open,setOpen]=useState(false);
      return React.createElement('div',{className:'faq-item'},
        React.createElement('h4',{onClick:()=>setOpen(!open),style:{cursor:'pointer'}},q),
        open&&React.createElement('p',null,a)
      );
    }
  
    function FAQWidget() {
      const faqs=[
        {q:'How do I toggle dark mode?',a:'Click the 🌙 icon in the header.'},
        {q:'Can I leave comments?',a:'Not yet—coming in the next update!'}
      ];
      return React.createElement('div',null,faqs.map((f,i)=>React.createElement(FAQItem,{key:i,...f})));  
    }
  
    ReactDOM.createRoot(document.getElementById('faq-root'))
      .render(React.createElement(FAQWidget));
  }
  
  // Question form (Help page)
  function initQuestionForm() {
    const { useState } = React;
  
    function QuestionForm() {
      const [title,setTitle]=useState('');
      const [email,setEmail]=useState('');
      const [desc,setDesc]=useState('');
      const [errors,setErrors]=useState({});
      const [submitted,setSubmitted]=useState(false);
  
      function validate() {
        const e={};
        if(!title.trim()) e.title='Title required';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email='Valid email required';
        if(!desc.trim()) e.desc='Description required';
        return e;
      }
  
      async function handleSubmit(ev) {
        ev.preventDefault();
        const e=validate();
        if(Object.keys(e).length) {
          setErrors(e);
          return;
        }
        setErrors({});
        const resp=await fetch('/api/questions',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({title,email,description:desc})
        });
        if(resp.ok) setSubmitted(true);
      }
  
      if(submitted) return React.createElement('div',{className:'thank-you'},'Thanks For The Question, My Anime Brother 🫡🫡🫡');
  
      return React.createElement('form',{onSubmit:handleSubmit,className:'help-form'},
        React.createElement('label',null,'Title'),
        React.createElement('input',{value:title,onChange:e=>setTitle(e.target.value),placeholder:'Brief summary'}),
        errors.title&&React.createElement('p',{className:'error'},errors.title),
        React.createElement('label',null,'Your Email'),
        React.createElement('input',{type:'email',value:email,onChange:e=>setEmail(e.target.value),placeholder:'you@example.com'}),
        errors.email&&React.createElement('p',{className:'error'},errors.email),
        React.createElement('label',null,'Description'),
        React.createElement('textarea',{value:desc,onChange:e=>setDesc(e.target.value),placeholder:'Describe your issue or question…'}),
        errors.desc&&React.createElement('p',{className:'error'},errors.desc),
        React.createElement('button',{type:'submit',className:'button-64'},
          React.createElement('span',{className:'text'},'Submit Question')
        )
      );
    }
  
    ReactDOM.createRoot(document.getElementById('question-form-root'))
      .render(React.createElement(QuestionForm));
  }
  