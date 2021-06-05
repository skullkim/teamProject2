$(document).ready(() => {
    const checkPassword = (password) => {
        const reg_passwd = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        return reg_passwd.test(password);
    }

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
        else if(!checkPassword(new_passwd)){
            message.text(`Password must contain at least 8 characters, one character, one number, and one special character`);
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

