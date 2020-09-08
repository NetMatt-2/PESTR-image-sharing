    const imgElmt = document.getElementById("img-elmt");
    const inp_search = document.getElementById("inp-search");
    const btn_search = document.getElementById("btn-search");
    const btn_next = document.getElementById("btn-next");
    const btn_add = document.getElementById("btn-add");
    const lst_attachments = document.getElementById("attachments");
    const inp_email = document.getElementById("inp-email");
    const icn_valid = document.getElementById("icn-valid");
    const btn_dispatch = document.getElementById("btn-dispatch");

    const client_ID = "Uv_yZcjNZnxkhGrHC9ElvfqXyyB54hjj_mkboc5zK9w";

    let imgSrcArr = [];         //Record URLs of fetched images 
    let imgAltArr = [];         //Record alt text of fetched images
    let randomOrder = [];       //Generate a random order through which to iterate the images
    let imageIndex = -1;        //Iterate through image arrays

    let attachedImages = [];    //Hold images attached to current email

    let email_valid = false;    //Is the email address valid?

////////////////
/* INITIALISE */
////////////////

//
//Check for locally stored url database
//    if (localStorage.getItem("imgSrcArr") != null) {
//        console.log("Retrieving local data...");
//        imgSrcArr = localStorage.getItem("imgSrcArr").split(', ');   //<== Local storage will have stored this as a string using the toString() method; to reverse this just use .split(',')
//        console.log(imgSrcArr);
//        randomOrder = GenerateRandomOrder(imgSrcArr);
//Else fetch database, store as a variable, and write to local storage for good measure
//    } else {
//        console.log("Fetching data from Unsplash.com...");
//        FetchData()
//        .then(data => DoSomething(data));
//    }
//


///////////////////////////
/* LISTEN FOR USER INPUT */
///////////////////////////

//Search button
    btn_search.addEventListener('click', ()=>{
        let query = inp_search.getAttribute('placeholder');
        if (inp_search.value != "") {
            query = inp_search.value;
        }
        let url = `https://api.unsplash.com/search/photos/?client_id=${client_ID}&query=${query}`;
        FetchData(url)
        .then(data => DoSomething(data));
    });

//Get Next Image button
    btn_next.addEventListener('click', ()=>{
        if (imgSrcArr.length > 0) {
            DisplayNewImage();
        }
    });
//Attach Image button
    btn_add.addEventListener('click', ()=>{
        if (imgSrcArr.length > 0) {
            attachedImages.push(imgAltArr[randomOrder[imageIndex]]);
            let newAttachment = document.createElement('li');
            newAttachment.textContent = `${imgAltArr[randomOrder[imageIndex]]}`;
            lst_attachments.appendChild(newAttachment);
            DisplayNewImage();
        }
    });
//Validate email input
    inp_email.addEventListener('change', ()=>{
        ValidateEmail(inp_email.value)              //<== We enclose this in an arrow function because otherwise it excecutes immediately.
    });
//Send email
    btn_dispatch.addEventListener('click', ()=>{
        if (!email_valid) alert("Uh oh - You need to enter a valid email to PESTR your friends!");
        else if (attachedImages.length === 0) alert("Oh dear - You need to attach some images to PESTR your friends!");
        else {
            alert("Thanks for PESTRing your friends!");
            attachedImages.splice(0, attachedImages.length);
            lst_attachments.querySelectorAll('li').forEach(elem => {elem.parentNode.removeChild(elem);});
        }
    });


////////////////////
/* DATA FUNCTIONS */
////////////////////

//Get img data from Unsplash
    async function FetchData(url) {
        return (await fetch(url)).json();
    }

//Store required image data (urls) in variable and in localStorage
    // I think I originally did it this way because I wanted to
    // store the JSON object in a var but had trouble doing so.
    function DoSomething(data) {
        console.log(data);
    //Clear storage
        imgSrcArr.splice(0, imgSrcArr.length);
        imgAltArr.splice(0, imgSrcArr.length);
        localStorage.clear();
    //Write storage
        data.results.forEach(result => {
            imgSrcArr.push(result.urls.regular);
            imgAltArr.push(result.alt_description);
        });
        localStorage.setItem("imgSrcArr", imgSrcArr.join(", "));
        localStorage.setItem("imgAltArr", imgAltArr.join(", "));
    //Sort content
        randomOrder = GenerateRandomOrder(imgSrcArr);
        DisplayNewImage();
    }



/////////////////////
/* INPUT FUNCTIONS */
/////////////////////

    function DisplayNewImage() {
        imageIndex++;
        if (imageIndex === randomOrder.length) imageIndex = 0;
        imgElmt.setAttribute('src', imgSrcArr[randomOrder[imageIndex]]);
        imgElmt.setAttribute('alt', imgAltArr[randomOrder[imageIndex]]);
    }



///////////////////////
/* UTILITY FUNCTIONS */
///////////////////////

    function Die_Roll(min, max) {
        max = Math.floor(max) + 1;                                  //<== Add 1 to max because (Math.random()*max) will always return < max.
        min = Math.floor(min);                                      
        return (Math.floor(Math.random() * (max - min)) + min);     //<== If Math.floor(Math.random()*range) === 0 function returns min;
    }

    function GenerateRandomOrder(inputArr = []) {
        let temp = [];
        for (let i = 0; i < inputArr.length; i++) {
            temp.push(i);
        }
        let randomOrder = [];
        for (let i = Die_Roll(0, (temp.length-1)); i < temp.length; i = Die_Roll(0, (temp.length-1))) {        //<== temp.length-1 here because if the length is 10, the indices go from 0-9, and we don't want Die_Roll to return a 10.
            randomOrder.push(temp[i]);
            temp.splice(i, 1);
        }
        return randomOrder;
    }

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        //Success
            icn_valid.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/845/845646.svg)";
            email_valid = true;
        } else {
        //Failure
            icn_valid.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/845/845648.svg)";
            email_valid = false;
        }
    }