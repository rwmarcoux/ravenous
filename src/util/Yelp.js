const clientId = 'uSCV8rQX2YB0kDdN7OAnXw';
const secret = 'k6p76H3fOoesVq6Ugb5bMatRg4OnZKX6XhiU0dgyk0StsSmVYLJNgsaO7JlDHCwD';
let accessToken;
const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
const accessTokenUrl = corsAnywhereUrl + 'https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + secret;

const Yelp = {
    getAccessToken: function(){
        if(accessToken){
            return new Promise(resolve => resolve(accessToken));
        } return fetch(accessTokenUrl,{
               method: 'POST'
           }).then(response => response.json()).then(jsonResponse => { 
            accessToken = jsonResponse.access_token;});
    },
    
     search: function(term, location, sortBy){
        return Yelp.getAccessToken().then(() => {
            const yelpRetrieveUrl =`${corsAnywhereUrl}https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
            return fetch(yelpRetrieveUrl, {headers: {Authorization:`Bearer ${accessToken}`}})
        }).then(response => response.json()).then(jsonResponse => {
            if(jsonResponse.businesses){
                return jsonResponse.businesses.map(business => ({
                    id: business.id,
                    imageSrc: business.image_url,
                    name: business.name,
                    address: business.location.address1,
                    city: business.location.city,
                    state: business.location.state,
                    zipCode: business.location.zip_code,
                    category: business.categories.title,
                    rating: business.rating,
                    reviewCount: business.review_count,
                    url: business.url
                }));
            }
        })
    }
};

export default Yelp;