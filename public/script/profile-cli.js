$(document).ready(() => {
    const my_postings = $('#user-info__postings');
    const displayWritten = (id, category, title) => {
        const $written = $(
            `<div>
            <h2><a class="links" href=/letter/written?written=${id}>${title}</a></h2>
             <span>
                 category: <a class="links" href="/letter/result?scope=category&target=${category}">${category}</a>    
             </span>
             <a class="links" href="/auth/edit-posting?written=${id}">수정</a>
             <a class="links" href="/auth/remove-posting?written=${id}">삭제</a>
        </div>`);
        my_postings.append($written);
    }
    const my_comments = $('#user-info__comments');
    const displayComment = (id, comment) => {
        const $div = $(`
            <div class="comment">
                <p>댓글: ${comment}</p>
                <button class="comments__edit">수정</input>
                <button class="comments__remove">삭제</button>
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

    //댓글 수정
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

    //댓글 삭제
    $(document).on('click', '.comments__remove', function(){
        const id = $(this).next().html();
        const remove = $(this).parent();
        remove.remove();
        axios({
            method: 'delete',
            url: `/auth/remove-comment?id=${id}`,
            contentType: 'application/json',
            cacheControl: 'no-cache',
            data:{
                id,
            }
        })
            .then((res) => {
                console.log('success');
            })
            .catch((err) => {
                console.error(err);
            })
    })
});