$(document).ready(function(){
    const submit_btn = $('#local__submit');
    //올바른 이메일 주소인지를 판단
    const checkEmail = (email) => {
        const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        return !reg_email.test(email) ? false : true;
    }
    //나이에 숫자만 포함되 있는지 판단
    const checkAge = (age) => {
        const reg_age = /^[0-9]*$/;
        return !reg_age.test(age) ? false : true;
    }
    submit_btn.click(() => {
        const name =  $('#local__name').val();
        const age = $('#local__age').val();
        const passwd1 = $('#local__passwd1').val();
        const passwd2 = $('#local__passwd2').val();
        const email = $('#local__email').val();
        const message = $('#message');
        if(passwd1 !== passwd2){
            message.text("incorrect password");
        }
        else if(!checkEmail(email)){
            message.text("incorrect email address");
        }
        else if(!checkAge(age)){
            message.text("incorrect age");
        }
        else{
            axios({
                method: 'put',
                url: '/signup/confirm-signup',
                contentType: 'application/json',
                cacheControl: 'no-cache',
                data:{
                    name,
                    email,
                    age,
                    passwd1,
                }
            })
                .then((response) => {
                    const {err} = response.data;
                    if(err){
                        message.text(err)
                    }
                    else{
                        location.href = '/';
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    })
})
