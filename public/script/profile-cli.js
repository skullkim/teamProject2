$(document).ready(() => {
    const my_postings = $('#user-info__postings');
    const displayWritten = (id, category, title) => {
        const $written = $(
            `<div>
            <h2><a href=/letter/written?written=${id}>${title}</a></h2>
             <span>
                 category: <a href="/letter/result?scope=category&target=${category}">${category}</a>    
             </span>
             <a href="/auth/edit-posting?written=${id}">수정</a>
             <a href="/auth/remove-posting?written=${id}">삭제</a>
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
        });
    axios({
        method: 'get',
        url: '/auth/wrote-comments',
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });
});