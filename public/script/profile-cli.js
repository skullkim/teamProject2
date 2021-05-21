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
<!--                <button id="comments__edit"><a href="/auth/edit-comment?id=${id}">수정</a></button>-->
                <button class="comments__edit">수정</input>
                <button id="comments__remove">삭제</button>
                <span class="comment-id" style="visibility: hidden">${id}</span>
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

    //console.log(edit_comment_btn);
    const edit_comment = $('.comments__edit').firstChild;
    $(document).on('click', '.comments__edit', function(){
        console.log($(this).next().next().html());
        const id = $(this).next().next().html();
        const new_comment = prompt("새로운 댓글을 입력하세요");
        $(this).prev().text(new_comment);
        axios({
            method: 'put',
            url: `/auth/comments-edit?id=${id}`,
            contentType: 'application/json',
            cacheControl: 'no-cache',
            data:{
                new_comment,
            }
        })
            .then((res) => {
                console.log('success');
            })
            .catch((err) => {
                console.error(err);
            })
    });
    // edit_comment_btn.click(() => {
    //     console.log(1111);
    //     console.log(edit_comment, $('comment-id').val());
    // })
});