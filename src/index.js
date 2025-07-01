document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
        alert("vamo a compartir acontinuación");
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Mira esta Pagina bro',
                url: window.location.href,
            }).catch((error) => {
                alert('No se pudo compartir el enlace', JSON.stringify(error));

            });
        } else {

            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Enlace copiado. Puedes compartirlo en Instagram.'))
                .catch(() => alert('No se pudo copiar el enlace.'));
        }
    });

});
