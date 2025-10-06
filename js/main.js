document.querySelector('button').addEventListener('click',changeSettings)


//Had to learn this nightmare of a datastructure, I used the documentation and this medium article to get started: https://medium.com/nerd-for-tech/how-to-fetch-data-from-the-anilist-api-graphql-using-axios-77527efc8a89
let query = `
query Page($page: Int, $perPage: Int, $genreIn: [String], $averageScoreGreater: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
        media(genre_in: $genreIn, averageScore_greater: $averageScoreGreater, type: $type) {
            title {
            romaji
            english
            }
            description
            externalLinks {
            url
            }
            coverImage {
            extraLarge
            }
            bannerImage
        }
    }
}
`;

// Define our query variables and values that will be used in the query request
let variables = {
    "page": 1,
    "perPage": 3,
    "genreIn": [],
    "averageScoreGreater": 79,
    "type": "ANIME",
};

// Define the config we'll need for our Api request
let url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        
    };

//slider functionality
let slider = document.getElementById("scoreAvg");
let output = document.getElementById("score");
output.textContent = slider.value; // Display the default slider value

// Update the current slider value
slider.oninput = function() {
    output.innerHTML = this.value;
    variables.averageScoreGreater = this.value;
}

function changeSettings() {
    const checkboxes = document.querySelectorAll('.genre')
    checkboxes.forEach(checkbox => {
        if(checkbox.checked) {
            console.log(checkbox.name)
            variables.genreIn.push(checkbox.name)
            console.log(variables.genreIn)   
        }

    

    options.body = JSON.stringify({
            variables: variables,
            query: query
            })

    })

    aniFetch()
}

function aniFetch() {
    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            const images = document.querySelectorAll('img')
            const titles = document.querySelectorAll('h3')
            const descs = document.querySelectorAll('p')
            const bgs = document.querySelectorAll('.title')
            
            images.forEach((image,idx) => {
                image.src = data.data.Page.media[idx].coverImage.extraLarge
            })
            titles.forEach((title,idx)=> {
                title.innerText = data.data.Page.media[idx].title.english
            })
            descs.forEach((desc,idx) => {
                desc.innerHTML = data.data.Page.media[idx].description
            })
            
        })
        .catch(handleError);
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}