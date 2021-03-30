const submit_btn = document.getElementById('local__submit');

//올바른 이메일 주소인지를 판
const checkEmail = (email) => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return !reg_email.test(email) ? false : true;
}
//나이에 숫자만 포함되 있는지 판
const checkAge = (age) => {
    const reg_age = /^[0-9]*$/;
    return !reg_age.test(age) ? false : true;
}

submit_btn.addEventListener('click', () => {
    const name = document.getElementById('local__name').value;
    const age = document.getElementById('local__age').value;
    const passwd1 = document.getElementById('local__passwd1').value;
    const passwd2 = document.getElementById('local__passwd2').value;
    const email = document.getElementById('local__email').value;
    const message = document.getElementById('message');
    if(passwd1 !== passwd2){
        message.innerText = "incorrect password";
    }
    else if(!checkEmail(email)){
        message.innerText = "incorrect email address";
    }
    else if(!checkAge(age)){
        message.innerText = "incorrect age";
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
                    message.innerText = err;
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