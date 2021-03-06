$(document).ready(() => {
   const url = (new URL(location.href)).searchParams;
   const written = url.get('written');
    const post = $('#main_post');
    let prev_title;
    //기존에 작성된 정보 로딩
   function displayPrevContext(context, all_tags){
        const{author, title, main_posting, main_category} = context.main_data;
        prev_title = title;
        $('#main__post').attr('action', `/auth/confirm-edit-posting?post_id=${written}`);
       $('#post__title').val(`${title}`)//제목
        $('#post__main-context').val(`${main_posting}`);//글 내용
       $('#post__main-context-len').html(`(${main_posting.length}/50000)`);
       $('#post__category').val(`${main_category}`).prop('selected', true);//메인 카테고리
       const tags = $('#post__tag');
       let ids = 0;
       //태그
       all_tags[`${main_category}`].forEach((tag) => {
           const id = `tag__${ids++}`;
           const new_tag = $(`
                <input type="checkbox" id="${id}" value="${tag}" name="tags"/>
                <label for="${id}">${tag}</label>
            `);
           context.tags.forEach((selected) => {
               if(tag == selected){
                   new_tag.prop('checked', true);
               }
           });
           tags.append(new_tag);
       });
       console.log(all_tags[`${main_category}`], context.tags);
   }
   //글 내용과 태그를 가져온다
   axios({
       method: 'get',
       url: `/letter/letter-context?written=${written}`,
       contentType: 'application/json',
       cacheControl: 'no-cache',
   })
       .then((context_res) => {
           axios({
               method: 'get',
               url: '/letter/categories',
               contentType: 'application/json',
               cacheControl: 'nocache',
           })
               .then((tags_response) => {
                   displayPrevContext(context_res.data, tags_response.data);

               })
               .catch((err) => {
                   console.error(err);
               });
       })
       .catch((err) => {
           console.error(err);
       });

   //다른 메인 카테고리 선택 시 그 카테고리 가져오기
    const getCategory = () => {
        const categories = $('#post__category')[0];
        return categories.options[categories.selectedIndex].value;
    }
    const category_option = $('#post__category');
    category_option.change(() => {
        $('#post__tag').children().remove();
        console.log($('#post_tag').children)
        const category = getCategory();
        console.log(category);
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
                let ids = 0, id
                tags.filter((ele) => ele !== '도서 추천')
                    .forEach((ele) => {
                    id = `category-${ids}`;
                    const check_box = $(`
                        <input type="checkbox" id="${id}" value=${ele} name="tag-box">
                        <label for="${id}">${ele}</label>
                    `);
                    tag.append(check_box);
                });
            })
            .catch((err) => {
                console.error(err);
            })
    });
    //수정내용 바꾸는 부분
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

    const main_context = $('#post__main-context');
    main_context.on('keyup', function() {
        $('#post__main-context-len').html(`${$(this).val().length}/50000`);
        console.log($(this).val().length);
        if($(this).val().length > 50000){
            $(this).val($(this).val().substring(0, 50000));
            $('#post__main-context-len').html('50000/50000');
        }
    })
});