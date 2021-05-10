$(document).ready(() => {
    const getSearchScope = () => {
        const search_scope = $('#search-list')[0];
        return search_scope.options[search_scope.selectedIndex].value;
    }
    const search_btn = $('#head__search-logo');
    search_btn.click(() => {
        const search_target = $('#head__search').val();
        const search_scope = getSearchScope();
       if(!search_scope){
           alert('검색 범위를 선택하세요');
           return;
       }
       else if(!search_target){
           alert('검색어를 입력하세요');
           return;
       }
       location.href=`/letter/result?scope=${search_scope}&target=${search_target}`;
    });
})