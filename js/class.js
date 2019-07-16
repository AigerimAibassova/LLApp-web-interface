// Initialize Firebase
var config = {
    apiKey: "AIzaSyDD7xVpB2V9fo3eWnj0p_EgRWz8gMC42wk",
    authDomain: "language-94092.firebaseapp.com",
    databaseURL: "https://language-94092.firebaseio.com",
    projectId: "language-94092",
    storageBucket: "language-94092.appspot.com",
    messagingSenderId: "632483945219"
};
firebase.initializeApp(config);

//DB ref
var db = firebase.database();

// Listen for form submit
document.getElementById("form").addEventListener("submit", submitForm);
document.getElementById("exType").addEventListener("change", exType);


//change innerHTML for different ex types
function exType() {
    var mySelect = document.getElementById("exType"),
    ex = document.getElementById("ex");
    var exb = "";

    //innerHTML for different types of exercises
    if (mySelect.value == "MA"){
        exb = '<div class="form-group">'
        + '<label>Question</label>'
        + '<input type="text" class="form-control" id="question" placeholder="Enter the question">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Image</label>'
        + '<input type="text" class="form-control" id="image" placeholder="Enter the image URL">'
        + '</div>'    
        + '<div class="form-group">'
        + '<label>Answer 1</label>'
        + '<input type="text" class="form-control" id="answer1" placeholder="Enter answer option 1">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer 2</label>'
        + '<input type="text" class="form-control" id="answer2" placeholder="Enter answer option 2">'
        + '</div>'     
        + '<div class="form-group">'
        + '<label>Answer 3</label>'
        + '<input type="text" class="form-control" id="answer3" placeholder="Enter answer option 3">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer 4</label>'
        + '<input type="text" class="form-control" id="answer4" placeholder="Enter answer option 4">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Correct answer</label>'
        + '<input type="text" class="form-control" id="corrAnswer" placeholder="Enter the correct answer">'
        + '</div>';
    }
    else if (mySelect.value == "TS"){
        exb = '<div class="form-group">'
        + '<label>Question</label>'
        + '<input type="text" class="form-control" id="question" placeholder="Enter the question">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Sentence</label>'
        + '<input type="text" class="form-control" id="sentence" placeholder="Enter the sentence in target language">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Correct translation</label>'
        + '<input type="text" class="form-control" id="corrAnswer" placeholder="Enter the correct translation">'
        + '</div>';
    }
    else if (mySelect.value == "LA"){
        exb = '<div class="form-group">'
        + '<label>Question</label>'
        + '<input type="text" class="form-control" id="question" placeholder="Enter the question">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Image</label>'
        + '<input type="text" class="form-control" id="image" placeholder="Enter the image URL">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>The word in target language</label>'
        + '<input type="text" class="form-control" id="translation" placeholder="Enter the word in its target language">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Its translation to native language</label>'
        + '<input type="text" class="form-control" id="word" placeholder="Enter its translation to native language">'
        + '</div>';
    }
    else if (mySelect.value == "BS"){
        exb = '<div class="form-group">'
        + '<label>Question</label>'
        + '<input type="text" class="form-control" id="question" placeholder="Enter the sentence with blank spaces">'
        + '<small id="nameHelp" class="form-text text-muted">You can enter the blank region as "_____" </small>'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer option 1</label>'
        + '<input type="text" class="form-control" id="answer1" placeholder="Enter the answer option 1">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer option 2</label>'
        + '<input type="text" class="form-control" id="answer2" placeholder="Enter the answer option 2">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer option 3</label>'
        + '<input type="text" class="form-control" id="answer3" placeholder="Enter the answer option 3">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Answer option 4</label>'
        + '<input type="text" class="form-control" id="answer4" placeholder="Enter the answer option 4">'
        + '</div>'
        + '<div class="form-group">'
        + '<label>Correct word</label>'
        + '<input type="text" class="form-control" id="corrAnswer" placeholder="Enter the order number of the correct word">'
        + '</div>';
    }

    ex.innerHTML = exb;
}


// Submit form
function submitForm(e){
    e.preventDefault();
    
    //collect all the fields
    var type = getInputVal("exType");
    var subject = getInputVal("subject");
    var level = getInputVal("level");

    var exBody = collEx(type);

    //save into DB
    saveEx(type, level, subject, exBody);

    //reset the form
    document.getElementById("form").reset();

}

//Get form values
function getInputVal(id){
    return document.getElementById(id).value;
}

//Save to firebase
function saveEx(type, level, subject, exBody){

    var id;
    var ref = db.ref('Lessons/Random/' + type + "/" + level + "/");
    ref.once('value', function(snapshot) { 
        
        // id by current number of elements
        id = snapshot.numChildren() + 1; 
        
        //setting the DB values
        if (type == "MA"){
            ref.child(id).set({
                type: type,
                subject: subject,
                question: exBody[0],
                image: exBody[1],
                answer1: exBody[2],
                answer2: exBody[3],
                answer3: exBody[4],
                answer4: exBody[5],
                corrAnswer: exBody[6],
            });
        }
        else if (type == "TS"){
            ref.child(id).set({
                type: type,
                subject: subject,
                question: exBody[0],
                sentence: exBody[1],
                corrAnswer: exBody[2],
            });
        }
        else if (type == "LA"){
            ref.child(id).set({
                type: type,
                subject: subject,
                word: exBody[0],
                translation: exBody[1],
                image: exBody[2], //add in body
                question: exBody[3],
            });
        }
        else if (type == "BS"){
            ref.child(id).set({
                type: type,
                subject: subject,
                question: exBody[0],
                answer1: exBody[1],
                answer2: exBody[2],
                answer3: exBody[3],
                answer4: exBody[4],
                corrAnswer: exBody[5],
            });
        }

    });
}

// Collect exercise body
function collEx(type){
    var exBody = [];

    if (type == "MA"){
        exBody.push(getInputVal("question"));
        exBody.push(getInputVal("image"));
        exBody.push(getInputVal("answer1"));
        exBody.push(getInputVal("answer2"));
        exBody.push(getInputVal("answer3"));
        exBody.push(getInputVal("answer4"));
        exBody.push(getInputVal("corrAnswer")); 
    }
    else if (type == "TS"){
        exBody.push(getInputVal("question"));
        exBody.push(getInputVal("sentence"));
        exBody.push(getInputVal("corrAnswer"));
    }
    else if (type == "LA"){
        exBody.push(getInputVal("word"));
        exBody.push(getInputVal("translation"));
        exBody.push(getInputVal("image")); 
        exBody.push(getInputVal("question"));
    }
    else if (type == "BS"){
        exBody.push(getInputVal("question"));
        exBody.push(getInputVal("answer1"));
        exBody.push(getInputVal("answer2"));
        exBody.push(getInputVal("answer3"));
        exBody.push(getInputVal("answer4"));
        exBody.push(getInputVal("corrAnswer"));
    }

    return exBody;
}


/*
db.ref('users/mtashkenbayev').set({
    name : "Mukhtar Tashkenbayev",
    profilePic : "asdsadfefwefew",
    nativeLang : "English",
    regDate : "03/21/2017",
    courses : {
        englishKazakh : {
            name : "English - Kazakh",
            settings : {
                initLevel : "Intermediate",
                targetLevel : "Advanced" ,
                intensity : 2,    //options: 1, 2, 3
                motivation : "For work",
            },
            currLevel : "Upper Intermediate",
            history : {
                sectionsProgress : {
                    section1 : "10/10",
                    section2 : "10/10",
                    section3 : "5/10",
                    section4 : "0/10",
                    section5 : "0/10"
                }
            }
        }
    }
});

ref.on("value", function(snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

*/