$(document).ready(() => {
    const main_section = $('#main__search-result');
    const displayWritten = (category, id, title) => {
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
                aside.append(`<p><a href="/letter/result?scope=category&target=${key}">${key}</a></p>`);
                const ul = $('<ul></ul>');
                value.forEach((tag) => {
                    ul.append(`<li><a href="/letter/result?scope=category&target=${tag}">${tag}</a></li>`);
                });
                aside.append(ul);
            });
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
        .then((res) => {
            console.log(res);
            if(!res.data.length){
                main_section.append('<h2>검색결과 없음</h2>');
                return;
            }
            if(target !== '도서 추천'){
                res.data.forEach((written) => {
                    console.log(written);
                    const {main_category, id, title} = written;
                    displayWritten(main_category, id, title);
                });
            }
            else{
                console.log(res);
            }
        })
        .catch((err) => {
            console.error(err);
        })
});