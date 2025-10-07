document.querySelector('button').addEventListener('click',changeSettings)


//Had to learn this nightmare of a datastructure, I used the documentation and this medium article to get started: https://medium.com/nerd-for-tech/how-to-fetch-data-from-the-anilist-api-graphql-using-axios-77527efc8a89
let query = `
query Page($page: Int, $perPage: Int, $genreIn: [String], $averageScoreGreater: Int, $type: MediaType, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
        media(genre_in: $genreIn, averageScore_greater: $averageScoreGreater, type: $type, seasonYear: $seasonYear) {
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
    "perPage": 8,
    "genreIn": [],
    "averageScoreGreater": 79,
    "type": "ANIME",
    "seasonYear": null
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
            
            variables.genreIn.push(checkbox.name)
              
        }
    })  
    
    variables.averageScoreGreater = slider.value

    variables.seasonYear = Number(document.querySelector('#year').value)

    console.log(variables)

    options.body = JSON.stringify({
            variables: variables,
            query: query
            })

    aniFetch()
}

function aniFetch() {
    
    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            // const images = document.querySelectorAll('img')
            const titles = document.querySelectorAll('h3')
            const descs = document.querySelectorAll('p')
            const bgs = document.querySelectorAll('.picture')
            
            bgs.forEach((bg,idx) => {
                bg.style.backgroundImage = `url('${data.data.Page.media[idx].coverImage.extraLarge}')`
                
            })
            titles.forEach((title,idx)=> {
                title.innerText = data.data.Page.media[idx].title.english
            })
            descs.forEach((desc,idx) => {
                desc.innerHTML = data.data.Page.media[idx].description
            })
            console.log(data)
        })
        .catch(handleError);
        document.querySelectorAll('.aniContainer').forEach(ani => ani.style.visibility='visible')
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