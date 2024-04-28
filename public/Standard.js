function AddNavMenu() {

    let ul = document.createElement("ul");

    let links = [
        { href: "./index.html", text: "Bus Lines / Lignes de Bus" },
        { href: "./InProgress.html", text: "Lines In Progress / Lignes En Cours" },
        { href: "./Map.html", text: "Map" }
    ];

    links.forEach(function(link) {
        let li = document.createElement("li");
        let a = document.createElement("a");

        a.href = link.href
        a.textContent = link.text

        li.appendChild(a);
        ul.appendChild(li);
    });

    document.body.appendChild(ul);
}