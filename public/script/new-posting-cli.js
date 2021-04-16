const submit_btn = document.getElementById('new-post__submit');
const message = document.getElementById('message');
const makeErrorMessage = (title, category, context) => {
    if(!title){
        message.innerText = "제목을 입력하세요";
        return false;
    }
    else if(!context){
        message.innerText = "내용을 입력하세요";
        return false;
    }
    else if(category === '=== 글 카테고리 ==='){
        message.innerText = "카테고리를 선택하세요";
        return false;
    }
    return true;
}
submit_btn.addEventListener('click', () => {
     const title = document.getElementById('post__title').value;
     const categories = document.getElementById('post__category');
     const category = categories.options[categories.selectedIndex].value;
     const context = document.getElementById('post__main-context').value;
     console.log(title, category, context);
     if(!makeErrorMessage(title, category, context)){
         return;
     }
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