axios({
    method: 'get',
    url: '/auth/user-info',
    contentType: 'application/json',
    cacheControl: 'no-cache',
})
    .then((response) => {
        //console.log(response);
        const {name, email, age} = response.data;
        const name_node = document.getElementById('edit-profile__name');
        const email_node = document.getElementById('edit-profile__email');
        const age_node = document.getElementById('edit-profile__age');
        name_node.setAttribute('placeholder', `name: ${name}`);
        email_node.setAttribute('placeholder', `email: ${email}`);
        age_node.setAttribute('placeholder', `age: ${age}`);
    })
    .catch((err) => {
        console.error(err);
    });

