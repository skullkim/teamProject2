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
                console.log(response);
            })
            .catch((err) => {
                console.error(err);
            })
    })

    const submit_btn = $('#new-post__submit');
    submit_btn.click(() => {
        const title = $('#post__title').val();
        const category = getCategory();
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
