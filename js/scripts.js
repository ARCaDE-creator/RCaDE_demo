document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('data/works.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'works.html' || currentPage === 'works_en.html') {
                displayWorks(data, currentPage);
            } else if (currentPage === 'index.html' || currentPage === 'index_en.html') {
                displayNewWorks(data, currentPage);
            } else {
                displayNewWorks(data, 'index.html');
            }
        });

    function displayWorks(works, currentPage) {
        const worksGallery = document.querySelector('.works-gallery-vertical');
        const mainWorkSection = document.querySelector('.main-work-section');

        if (!worksGallery || !mainWorkSection) return;

        const shuffledWorks = works.sort(() => Math.random() - 0.5);
        const urlParams = new URLSearchParams(window.location.search);
        const mainWorkId = urlParams.get('main');
        const mainWork = mainWorkId ? works.find(work => work.id === mainWorkId) : shuffledWorks[0];

        const lang = currentPage === 'works.html' || currentPage === 'index.html' ? 'ja' : 'en';

        const mainImage = mainWorkSection.querySelector('.featured-content img');
        mainImage.src = `images/${mainWork.id}/${mainWork[`image_${lang}`]}`;
        mainImage.alt = mainWork[`title_${lang}`];
        mainImage.dataset.images = mainWork[`images_${lang}`].join(',');

        mainWorkSection.querySelector('.work-details p:first-of-type').textContent = mainWork[`title_${lang}`];

        shuffledWorks.forEach(work => {
            if (work.id !== mainWork.id) {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');
                workItem.innerHTML = `
                    <p>${work[`title_${lang}`]}</p>
                    <img src="images/${work.id}/${work[`image_${lang}`]}" alt="${work[`title_${lang}`]}" class="illustration-link" data-images="${work[`images_${lang}`].join(',')}">
                `;
                worksGallery.appendChild(workItem);
            }
        });

        document.querySelectorAll('.illustration-link').forEach(link => {
            link.addEventListener('click', function() {
                const images = this.dataset.images.split(',');
                const popupImagesContainer = document.querySelector('.popup-images');
                popupImagesContainer.innerHTML = '';

                images.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    popupImagesContainer.appendChild(img);
                });

                document.getElementById('popup').style.display = 'flex';
                popupImagesContainer.scrollLeft = 0;
            });
        });

        const popup = document.getElementById('popup');
        const closeBtn = document.querySelector('.popup .close');
        closeBtn.addEventListener('click', () => popup.style.display = 'none');
        popup.addEventListener('click', event => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });

        mainImage.addEventListener('click', function() {
            const images = this.dataset.images.split(',');
            const popupImagesContainer = document.querySelector('.popup-images');
            popupImagesContainer.innerHTML = '';

            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.style.maxWidth = "100%";
                img.style.height = "auto";
                popupImagesContainer.appendChild(img);
            });

            document.getElementById('popup').style.display = 'flex';
            popupImagesContainer.scrollLeft = 0;
        });

        mainImage.addEventListener('mouseover', function() {
            this.classList.add('hover');
        });

        mainImage.addEventListener('mouseout', function() {
            this.classList.remove('hover');
        });
    }

    function displayNewWorks(works, currentPage) {
        const newWorksGallery = document.querySelector('.new-works-section .works-gallery');
        if (!newWorksGallery) return;

        const sortedWorks = works.sort((a, b) => new Date(b.date) - new Date(a.date));
        const lang = currentPage === 'index.html' || currentPage === 'works.html' ? 'ja' : 'en';

        sortedWorks.forEach(work => {
            const workItem = document.createElement('a');
            workItem.classList.add('work-item');
            
            const workPage = lang === 'en' ? 'works_en.html' : 'works.html';
            workItem.href = `${workPage}?main=${work.id}`;
            
            workItem.innerHTML = `
                <img src="images/${work.id}/${work[`image_${lang}`]}" alt="${work[`title_${lang}`]}">
                <div class="work-details">
                    <p><strong>${work[`title_${lang}`]}</strong></p>
                    <p class="datedoi">${lang === 'ja' ? '日付' : 'Date'}: ${work.date}</p>
                </div>
            `;
            newWorksGallery.appendChild(workItem);
        });
    }
});
