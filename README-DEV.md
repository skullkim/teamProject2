## 노드 서버 실행방법
  1. npm i(맨 처음 실행시에만 사용)
  2. npm i -D nodemon
  3. npm start
- - -
## 디렉토리 구조
  1. public - client-side js files,  css files<br>  
    1.1 script - client-side js files<br>  
    1.2 sctyle - css files<br>  
    * client-side js파일명은 파일명 뒤에 '-cli'를 붙일것<br>  
    * css 파일명은 파일명 뒤에 '-style'을 붙일것<br>
  2. routes - router files
  3. views - HTML and nunjucks files
- - - 
## 개발시
  1. .gitignore파일을 생성해 node_modules, .env를 추가
  2. .env 파일은 해당 프로젝트의 루트 디렉로리 하위에 추가.