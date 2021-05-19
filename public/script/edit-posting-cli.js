$(document).ready(() => {
   const url = (new URL(location.href)).searchParams;
   const written = url.get('written');
    const post = $('#main_post');
    //기존에 작성된 정보 로딩
   function displayPrevContext(context, all_tags){
        const{author, title, main_posting, main_category} = context.main_data;
       $('#post__title').val(`${title}`)//제목
        $('#post__main-context').val(`${main_posting}`);//글 내용
       $('#post__category').val(`${main_category}`).prop('selected', true);//메인 카테고리
       const tags = $('#post__tag');
       let ids = 0;
       //태그
       all_tags[`${main_category}`].forEach((tag) => {
           const id = `tag__${ids++}`;
           const new_tag = $(`
                <input type="checkbox" id="${id}" value="${tag}" name="tag-box"/>
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
});