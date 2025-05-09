const apiUrl = 'https://api.waifu.im/search';
const params = {
    included_tags: ['waifu', 'oppai'],
    height: '>=2000'
};

function buildRequestUrl() {
    const queryParams = new URLSearchParams();

    for (const key in params) {
        if (Array.isArray(params[key])) {
            params[key].forEach(value => {
                queryParams.append(key, value);
            });
        } else {
            queryParams.set(key, params[key]);
        }
    }

    return `${apiUrl}?${queryParams.toString()}`;
}

function loadImage() {
    const requestUrl = buildRequestUrl();
    const container = document.getElementById('image-container');

    container.innerHTML = '<div id="loader" class="spinner"></div>';
    container.classList.remove('fade-in');
    container.classList.add('fade-out');

    fetch(requestUrl)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Erro na requisição: ' + response.status);
        })
        .then(data => {
            const imageUrl = data.images?.[0]?.url;

            setTimeout(() => {
                if (imageUrl) {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = 'Imagem da API';
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '10px';

                    container.innerHTML = '';
                    container.appendChild(img);
                } else {
                    container.textContent = 'Nenhuma imagem encontrada.';
                }

                container.classList.remove('fade-out');
                container.classList.add('fade-in');
            }, 300);
        })
        .catch(error => {
            console.error(error);
            container.textContent = 'Erro ao carregar imagem.';
            container.classList.remove('fade-out');
            container.classList.add('fade-in');
        });
}

loadImage();
document.getElementById('load-btn').addEventListener('click', loadImage);
