
    window.addEventListener("load", () => {
        if ("serviceWorker" in navigator) {
            console.log("Service worker is present!");
        navigator.serviceWorker.register('../serviceWorker.js').then(function(registration) {
            console.log('Service worker registration succeeded:', registration);
          }, /*catch*/ function(error) {
            console.log('Service worker registration failed:', error);
          });
        } else {
          console.log('Service workers are not supported.');
        }
      });

    (function(){
        const container = document.getElementById("container");
        const loading = document.querySelector('.loading');
        const onPageLoad = document.querySelector('.onPageLoad');
        

        // Global variables
        var page = 1;
        var per_page = 30;
        var total_pages;
        getPost();

        
        // Scrolling event 
        document.onreadystatechange = () => {
        if(document.readyState === 'complete'){
        
            window.addEventListener('scroll', () => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
            
                if(Math.ceil(scrolled) >= scrollable){
                    if(page <= total_pages){
                        page = page + 1;
                        showLoading();
                    }
                    else{
                        alert("Sorry, We are finished all the articles!");
                    }
                }
            })
             
        }
        }   
        
        // Balls animation function
        function showLoading() {
            loading.classList.add('show');
            
            // load more data
            setTimeout(getPost, 1000)
        }
        
        // Asynchronous function to get the data
        async function getPost() {
        
            var url = "https://www.techinasia.com/wp-json/techinasia/2.0/posts?page="+page+"&per_page=30";
            var postResponse = await fetch(url);
            var data = await postResponse.json();
            console.log(data);
            total_pages = data.total_pages;
            data.posts.forEach( (post) => {
                const postElement = document.createElement("div");
                postElement.classList.add("blog-post");
                
            
                function format(input) {
                    return new Date(input).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                }
                var postDate = format(post.date_gmt);
                
                try {
                    post.content
                } catch (error) {
                    console.log("Cant fetch the content!");
                }
                finally{
                postElement.innerHTML = `
                <div class="post ">
                    
                    <h3 class="title" >${post.title}</h3>
                    <h4 class="postDate">${postDate}</h4>
                    <img class="image" src="${post.featured_image.source}" alt="image" />
                    <h4 class="author">Written by :${post.author.display_name}</h4>
                    
                    <div id="more-1" class="desc">
                    ${post.content}
                    
                    </div>
                    <button class="readmore-btn">Read More</button>
          
                </div>
                `;
               
            container.appendChild(postElement);
                }
            // Show more functionality
                var flag = false;
        
        // document.addEventListener( "DOMContentLoaded" ,() => {
        if ('querySelector' in document && 
        'addEventListener' in window) {
        var toggleButtons = document.querySelectorAll(".readmore-btn");
        
        
        toggleButtons.forEach(toggleButton => {
            
            // add listener for each button
            toggleButton.addEventListener('click', function () {
        
                fullTextWrapper = this.parentElement.querySelector('.desc');
                
                // change attributes and text if full text is shown/hidden
                if(flag === true){
                     flag = false;   
                    this.parentElement.classList.remove("showContent");
                    this.innerHTML = "Read More";
                    }
                else{
                    flag = true;
                    this.parentElement.classList.add("showContent");
                    this.innerHTML = "Read Less" ;
                }
          
            });
            
        })
        }
        // })
        
            
            // onPageLoad.classList.remove('show');
            loading.classList.remove('show');
             })
        };
        
    }())


