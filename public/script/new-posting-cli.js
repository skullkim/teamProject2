$(document).ready(() => {
    const submit_btn = $('#new-post__submit');
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
    submit_btn.click(() => {
        const title = $('#post__title').val();
        const categories = $('#post__category')[0];
        const category = categories.options[categories.selectedIndex].value;
        const context = $('#post__main-context').val();
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
                    message.text(err);
                }
                else{
                    location.href="/";
                }
            })
            .catch((err) => {
                console.error(err);
            })
    });
});
