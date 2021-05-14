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
})

