const url = (new URL(location.href)).searchParams;
const written = url.get('written');
//console.log(written);

const makeMainContext = (data) => {
    const main = document.getElementById('main');
    const {author, main_category, title, main_posting} = data;
    const div = document.createElement('div');
    div.id = "main__context";
    div.innerHTML = `
        <h3 id="context__id">${title}</h3>
        <h4 id="context__author">글쓴이: ${author}</h4>
        <p id="context__written">${main_posting}</p>
        <span id="context__category">#${main_category}</span>
    `;
    main.appendChild(div);
}

axios({
    method: "get",
    url: `/letter/letter-context?written=${written}`,
    contentType: 'application/json',
    cacheControl: 'no-cache',
})
    .then((response) => {
        makeMainContext(response.data);
    })
    .catch((err) => {
        console.error(err);
    })