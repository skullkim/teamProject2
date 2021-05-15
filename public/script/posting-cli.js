$(document).ready(() => {
    const url = (new URL(location.href)).searchParams;
    const written = url.get('written');
    //글에대한 정보를 페이지에 로딩
    const makeMainContext = (data) => {
        const main = $('#main');
        const {author, main_category, title, main_posting} = data.main_data;
        const {tags} = data;
        const $div =  $(
            `<div id="main__context">
                <h3 id="context__id">${title}</h3>
                <h4 id="context__author">글쓴이: ${author}</h4>
                <p id="context__written">${main_posting}</p>
                <div id="context__category">
                    <span class="categories">#${main_category}</span>
                </div>
            </div>`);
        main.prepend($div);
        const category = $('#context__category');
        tags.forEach((tag) => {
            category.append(
                `<span class="categories">#${tag}</span>
            `);
        });

    }
    const comment_area = $('#main__comments');
    const makeComment = (name, comment) => {
        const div = $(`
            <div class="comments">
                <p>${name}</p>
                <p>${comment}</p>
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
            console.log(response);
            makeMainContext(response.data);
        })
        .catch((err) => {
            console.error(err);
        });
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
               console.log(name);
               makeComment(name, comment);
           })
           .catch((err) => {
               console.error(err);
           })
    });

})
