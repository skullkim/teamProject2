$(document).ready(() => {
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
    axios({
        method: 'get',
        url: '/auth/user-info',
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            const {name, email, age} = response.data;
            const name_node = $('#edit-profile__name');
            const email_node = $('#edit-profile__email');
            const age_node = $('#edit-profile__age');
            name_node.attr('placeholder', `name: ${name}`);
            email_node.attr('placeholder', `email: ${email}`);
            age_node.attr('placeholder', `age: ${age}`);
        })
        .catch((err) => {
            console.error(err);
        });

    const submit_btn = $('#edit-profile__submit');
    submit_btn.click(() => {
        const name = $('#edit-profile__name').val();
        const email = $('#edit-profile__email').val();
        const age = $('#edit-profile__age').val();
        const message = $('#edit-profile__message');
        if(email && !checkEmail(email)){
            message.text("incorrect email address");
        }
        else if(age && !checkAge(age)){
            message.text("incorrect age");
        }
        else{
            axios({
                method: 'PUT',
                url: '/auth/edit-user-info',
                contentType: 'application/json',
                cacheControl: 'no-cache',
                data:{
                    name,
                    email,
                    age,
                }
            })
                .then((response) => {
                    const {err} = response.data;
                    if(err){
                        console.error(err);
                        message.text(err);
                    }
                    else{
                        message.text('success');
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }

    });
})

