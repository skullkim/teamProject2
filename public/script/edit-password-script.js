
const message = document.getElementById("message");
const submit_btn = document.getElementById("passwd__submit");
submit_btn.addEventListener('click', () => {
    const prev_passwd = document.getElementById("passwd__prev").value;
    const new_passwd = document.getElementById("passwd__new-passwd1").value;
    const new_passwd2 = document.getElementById("passwd__new-passwd2").value;
    console.log(new_passwd, " ", new_passwd2);
    if(new_passwd !== new_passwd2) {
        message.innerText = "incorrect verify passsword";
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
                message.innerText = err;
            }
            else{
                message.innerText = "successed to change password";
            }
        })
        .catch((err) => {
            console.error(err);
        });
})
