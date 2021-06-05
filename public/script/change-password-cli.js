$(document).ready(() => {
    const checkEmail = (email) => {
        const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        return !reg_email.test(email) ? false : true;
    }
    const checkPassword = (password) => {
        const reg_passwd = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        return reg_passwd.test(password);
    }
    const submit_btn = $('#change-passwd__submit');
    submit_btn.click(() => {
        const email = $('#change-passwd__email').val();
        const passwd1 = $('#change-passwd__passwd1').val();
        const passwd2 = $('#change-passwd__passwd1').val();
        const err_message = $('#change-passwd__error-message');
        console.log(email, passwd1, passwd2);
        if(!checkEmail(email)){
            err_message.text('incorrect email format');
        }
        else if(passwd1 != passwd2){
            err_message.text('incorrect password');
        }
        else if(!checkPassword(passwd1)){
            err_message.text(`Password must contain at least 8 characters, one character, one number, and one special character`);
        }
        else{
            axios({
                method: 'PUT',
                url: '/login/confirm-new-password',
                contentType: 'application/json',
                cacheControl: 'no-cache',
                data:{
                    email,
                    password: passwd1,
                }
            })
                .then((response) => {
                    const {err} = response.data;
                    if(err) {
                        err_message.text(err);
                    }
                    else{
                        location.href='../'
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    });

})