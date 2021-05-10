$(document).ready(() => {
    axios.get('/letter/categories')
        .then((res) => {
            const categories = res.data;
            const aside = $('#main__category');
            $.each(categories, (key, value) => {
                aside.append(`<p><a href="">${key}</a></p>`);
                const ul = $('<ul></ul>');
                value.forEach((tag) => {
                    ul.append(`<li><a href="">${tag}</a></li>`);
                });
                aside.append(ul);
                //console.log(key, value);
            })
        })
        .catch((err) => {
            console.error(err);
        });
});