$(document).ready(() => {
   const url = (new URL(location.href)).searchParams;
   const written = url.get('written');
   // let context;
   // let all_tags;
    const post = $('#main_post');
   function displayPrevContext(context, all_tags){
        const{author, title, main_posting, main_category} = context.main_data;
       $('#post__title').val(`${title}`)
        $('#post__main-context').val(`${main_posting}`);
   }
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