document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(
        ".food-card, .reuse-card"
    );

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry, index) {

                if (entry.isIntersecting) {

                    setTimeout(function () {

                        entry.target.classList.add("show");

                    }, index * 80);

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.1
        }
    );


    cards.forEach(function (card) {
        observer.observe(card);
    });

});
