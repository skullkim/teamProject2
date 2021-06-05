$(document).ready(() => {
    const getCategory = () => {
        const categories = $('#post__category')[0];
        return categories.options[categories.selectedIndex].value;
    }

    const message = $('#message');
    const makeErrorMessage = (title, category, context) => {
        if(!title){
            message.text("제목을 입력하세요")
            return false;
        }
        else if(!context){
            message.text("내용을 입력하세요");
            return false;
        }
        else if(category === '=== 글 카테고리 ==='){
            message.text("카테고리를 선택하세요");
            return false;
        }
        return true;
    }

    const category_options = $('#post__category');
    category_options.change(() => {
        const category = getCategory();
        axios({
            method: 'post',
            url: '/letter/tags',
            contentType: 'application/json',
            cacheControl: 'nocache',
            data: {category}
        })
            .then((response) => {
                //console.log(response);
                const {tags} = response.data;
                const tag = $('#post__tag');
                tag.children().remove();
                let ids = 0, id
                tags.filter((ele) => ele !== '도서 추천')
                    .forEach((ele) => {
                    id = `category-${ids}`;
                    const check_box = $(`
                        <input type="checkbox" id="${id}" value=${ele} name="tags">
                        <label for="${id}">${ele}</label>
                    `);
                    tag.append(check_box);
                });
            })
            .catch((err) => {
                console.error(err);
            })
    })
    const main_context = $('#post__main-context');
    main_context.on('keyup', function() {
        $('#post__main-context-len').html(`${$(this).val().length}/50000`);
        //console.log(this);
        console.log($(this).val().length);
        if($(this).val().length > 50000){
            $(this).val($(this).val().substring(0, 50000));
            $('#post__main-context-len').html('50000/50000');
        }
    })
});
