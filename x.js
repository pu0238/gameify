const axios = require('axios')
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios
  .get(
    "https://store.steampowered.com/api/featuredcategories/?language=russian&cc=RU"
  )
  .then(({ data }) => {
    console.log(data);
  });
