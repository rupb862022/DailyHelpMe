
const MAIN_URL = 'https://proj.ruppin.ac.il/bgroup86/prod';

export const serverFetchAPI = (route, method,body) => 
new Promise((resolve, reject) => {
  fetch( MAIN_URL+'/' +route, {
    method: method,
    body: body,
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
  })
    .then(res => {
      resolve(res.json());
    })
    .catch(err => reject(err));
})
