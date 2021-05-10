$(document).ready(() => {
    const main_section = $('#main__letters');
    const displayWritten = (id, category, title) => {
        const $written = $(
        `<div>
            <h2><a href=/letter/written?written=${id}>${title}</a></h2>
             <span>
                 category: <a href="/letter/categories?category=${category}">${category}</a>    
             </span>
        </div>`);
        main_section.append($written);
    }
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
    axios.get('/auth/postings')
        .then((res) => {
            res.data.forEach((written) => {
                const {id, main_category, title} = written;
                displayWritten(id, main_category, title);
            })
        })
        .catch((err) => {
            console.error(err);
        });
})
