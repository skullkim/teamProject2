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
    const my_comments = $('#user-info__comments');
    const displayComment = (id, comment) => {
        const $div = $(`
            <div>
                <span>댓글: ${comment}</span>
                <button id="comments__edit"><a href="/auth/edit-comment?id=${id}">수정</a></button>
                <button id="comments__remove"><a href="/auth/remove-comment?id=${id}">삭제</a></button>
            </div>
        `);
        my_comments.append($div);
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
            response.data.forEach((data) => {
                const {id, comment} = data;
                console.log(id, comment);
                displayComment(id, comment);
            })
        })
        .catch((err) => {
            console.error(err);
        });
});