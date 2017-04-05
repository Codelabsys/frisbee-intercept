# frisbee-intercept
[![NPM](https://nodei.co/npm/frisbee-intercept.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/frisbee-intercept/)  
Create Interceptors for your frisbee APIs so you can add headers to requests and pre-process the server reponses.

## Getting Started

### Prerequisites

As its name implies, [frisbee](https://github.com/crocodilejs/frisbee) should be installed to intercept its requests. Follow the Installation steps in their repository.

### Installing

```
npm install --save  frisbee-intercept
```

## Usage

```js
import Frisbee from 'frisbee';
import FrisbeeAPIInterceptor from 'frisbee-intercept'

// create a new instance of Frisbee 
const myAPI = new Frisbee({
    baseURI: "http://myBaseURI.com.eg/",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

//Create an intereption wrapper arround your API
var myAPIInterceptor = FrisbeeAPIInterceptor(myAPI);

//register your interceptor with your API, ** you can register as many interceptors as you want to your api **
const unregister = myAPIInterceptor.register({
    request: function (url, config) {
        // Modify the url or config here
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        //Handle Forbidden status code

        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        return Promise.reject(error);

    }
});

//make your requests to see interception in action
myAPI.post("Account/Login", { body: {} });

// Unregister your interceptor
unregister();
```

## Credits

* This code was taken from [fetch-intercept](https://github.com/werk85/fetch-intercept) and adapted to work with frisbee APIs
* This library was developed at [Codelabsys](http://www.codelabsys.com/)
