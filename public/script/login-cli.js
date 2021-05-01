$(document).ready(function (){
    const submit_btn = $('#login__submit');
    const checkEmail = (email) => {
        const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        return !reg_email.test(email) ? false : true;
    }
    submit_btn.click( () => {
        const email = $('#local__name').val();
        const password = $('#local__password').val();
        const message = $('#login__err-message');
        console.log(email, password);
        if(!checkEmail(email)){
            message.text("incorrect email address");
        }
        else {
            axios({
                method: 'post',
                url: '/login/confirm-login',
                contentType: 'application/json',
                cacheControl: 'no-cache',
                data: {
                    email,
                    password,
                }
            })
                .then((response) => {
                    const {err} = response.data;
                    if (err) {
                        //message.innerText = err;
                        message.text(err);
                    } else {
                        location.href = '/';
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
})
