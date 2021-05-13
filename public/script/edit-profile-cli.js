$(document).ready(() => {
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
    const name = $('#edit-profile__name');
    const email = $('#edit-profile__email');
    const age = $('#edit-profile__age');
    submit_btn.click(() => {
        axios({
            method: 'PUT',
            url: '/auth/edit-user-info',
            contentType: 'application/json',
            cacheControl: 'no-cache',
            data:{
                name, email, age
            }
        })
            .then((response) => {
                const {err} = response.data;
                if(err){

                } else {

                }
            })
    });
})

