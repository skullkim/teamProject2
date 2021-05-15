$(document).ready(() => {
    const my_postings = $('#user-info__postings');
    const displayWritten = (id, category, title) => {
        const $written = $(
            `<div>
            <h2><a href=/letter/written?written=${id}>${title}</a></h2>
             <span>
                 category: <a href="/letter/categories?category=${category}">${category}</a>    
             </span>
        </div>`);
        my_postings.append($written);
    }
    axios({
        method: 'get',
        url: '/auth/wrote-postings',
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            response.data.forEach((posting) => {
                const {id, main_category, title} = posting;
                displayWritten(id, main_category, title);
            })
        })
        .catch((err) => {
            console.error(err);
        })
});