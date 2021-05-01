$(document).ready(() => {
    const message = $('#message');
    const submit_btn = $('#passwd__submit');
    submit_btn.click(() => {
        const prev_passwd = $('#passwd__prev').val();
        const new_passwd = $('#passwd__new-passwd1').val();
        const new_passwd2 = $('#passwd__new-passwd2').val();
        if(new_passwd !== new_passwd2) {
            message.text("incorrect verify passsword")
            return;
        }
        axios({
            method: 'put',
            url: '/auth/confirm-edit-password',
            contentType: 'application/json',
            cacheControl: 'no-cache',
            data:{
                prev_passwd,
                new_passwd,
            }
        })
            .then((response) => {
                const {err} = response.data;
                if(err){
                    message.text(err);
                }
                else{
                    message.text("successed to change password");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    })
})

