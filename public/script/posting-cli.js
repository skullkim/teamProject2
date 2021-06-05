$(document).ready(() => {
    const url = (new URL(location.href)).searchParams;
    const written = url.get('written');
    //글에대한 정보를 페이지에 로딩
    const makeMainContext = (data) => {
        const main = $('#main');
        const {author, main_category, title, main_posting} = data.main_data;
        const {tags, posting_id, images} = data;
        const $div =  $(
            `<div class="posting-infos" id="main__context">
                <h3 id="context__id">제목: ${title}</h3>
                <h4 id="context__author">글쓴이: ${author}</h4>
                <hr>
                <textarea id="context__written" readonly>${main_posting}</textarea>
                <div id="context__category">
                    <span class="categories">#${main_category}</span>
                </div>
            </div>`);

        main.prepend($div);
        const written_area = $('#context__written');
        written_area.css('height', 'auto');
        written_area.css('height', written_area[0].scrollHeight);
        const context_category = $('#context__category');
        const img_div = (`<div class="posting-infos" id="context__images"></div>`);
        context_category.before(img_div);
        const image = $('#context__images');
        images.forEach((img) => {
            image.append(`
                <img src="/letter/posting-images?post_id=${posting_id}&img_id=${img.id}" alt="posting images" class="posting-imgs">
            `);
        });
        const category = $('#context__category');
        tags.forEach((tag) => {
            category.append(
                `<span class="categories">#${tag}</span>
            `);
        });
        category.append(`<hr>`);
    }
    //댓글 정보를 페이지에 로딩
    const comment_area = $('#main__comments');
    const makeComment = (name, comment) => {
        const div = $(`
            <div class="posting-infos comments">
                <p>${name}</p>
                <p id="comment">${comment}</p>
            </div>
        `);
        comment_area.append(div);
    }
//글 가져오기
    axios({
        method: "get",
        url: `/letter/letter-context?written=${written}`,
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            console.log(response.data.posting_id);
            makeMainContext(response.data);
        })
        .catch((err) => {
            console.error(err);
        });
    //댓글 가져오기
    axios({
        method: "get",
        url: `/letter/letter-comments?written=${written}`,
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            response.data.forEach((comment) => {
                makeComment(comment.commenter, comment.comment);
            });
        })
        .catch((err) => {
            console.error(err);
        })
//작성한 댓글 추가
    const comment_submit = $('#comment-input__submit');
    comment_submit.click(() => {
       const comment = $('#comment-input__comment').val();
       axios({
           method: 'PUT',
           url: '/auth/new-comment',
           contentType: 'application/json',
           cacheControl: 'no-cache',
           data: {
               comment,
               written,
           }
       })
           .then((response) => {
               const {name} = response.data;
               makeComment(name, comment);
           })
           .catch((err) => {
               console.error(err);
           })
    });
    const comment_len = $('#comment-input__len');
    $('#comment-input__comment').on('keyup', function() {
        comment_len.html(`${$(this).val().length}/800`);
        if($(this).val().length > 800){
            $(this).val($(this).val().substring(0, 800));
            comment_len.html('800/800');
        }
    });
})
