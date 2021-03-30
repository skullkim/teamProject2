const submit_btn = document.getElementById('login__submit');
const checkEmail = (email) => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return !reg_email.test(email) ? false : true;
}
submit_btn.addEventListener('click', () =>{
    const email = document.getElementById('local__name').value;
    const password = document.getElementById('local__password').value;
    const message = document.getElementById('login__err-message');
    if(!checkEmail(email)){
        message.innerText = "incorrect email address";
    }
    else{
        axios({
            method: 'post',
            url: '/login/confirm-login',
            contentType: 'application/json',
            cacheControl: 'no-cache',
            data:{
                email,
                password,
            }
        })
            .then((response) => {
                const {err} = response.data;
                if(err){
                    message.innerText = err;
                }
                else{
                    location.href='/';
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
});