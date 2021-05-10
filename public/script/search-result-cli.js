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

    const url = (new URL(location.href)).searchParams;
    const scope = url.get('scope');
    const target = url.get('target');
    axios({
        method: 'get',
        url: `/letter/search-${scope}?target=${target}`,
        contentType: 'application/json',
        cacheControl: 'no-cache',
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.error(err);
        })
});