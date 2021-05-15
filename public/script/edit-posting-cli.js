$(document).ready(() => {
   const url = (new URL(location.href)).searchParams;
   const written = url.get('written');
   console.log(written);
});