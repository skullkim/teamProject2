const main_section = document.getElementById("main__letters");
const displayWritten = (id, category, title) => {
    const written = document.createElement('div');
    written.innerHTML = `
        <h2><a href=/letter/written?written=${id}>${title}</a></h2>
        <span>
            category: <a href="/letter/categories?category=${category}">${category}</a>    
        </span>
    `;
    main_section.appendChild(written);
}
axios.get('/auth/postings')
    .then((res) => {
        res.data.forEach((written) => {
            const {id, main_category, title} = written;
            displayWritten(id, main_category, title);
        })
    })
    .catch((err) => {
        console.error(err);
    });