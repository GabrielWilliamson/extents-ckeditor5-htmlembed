document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Mira esta Pagina bro',
                url: window.location.href,
            }).catch((error) => {
                console.error('Error compartiendo:', error);
            });
        } else {

            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Enlace copiado. Puedes compartirlo en Instagram.'))
                .catch(() => alert('No se pudo copiar el enlace.'));
        }
    });

});
