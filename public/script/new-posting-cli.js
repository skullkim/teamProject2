const submit_btn = document.getElementById('new-post__submit');
submit_btn.addEventListener('click', () => {
     const title = document.getElementById('post__title').value;
     const categories = document.getElementById('post__category');
     const category = categories.options[categories.selectedIndex].value;
     const context = document.getElementById('post__main-context').value;
     console.log(title, category, context);
     axios({
         method: 'put',
         url: '/auth/new-posting',
         contentType: 'application/json',
         cacheControl: 'no-cache',
         data:{
             title,
             category,
             context,
         }
     })
         .then((response) => {
             const{err} = response.data;
             if(err){
                 message.innerText = err;
             }
             else{
                 location.href="/";
             }
         })
         .catch((err) => {
             console.error(err);
         })
});