//init the firebase connection
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

function download(filename, text) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


window.onload = function() {
   
    // LEGEND text
    var legend = "<br>BS - Filling in the blank spaces.\n";
    legend += "MA - Select a word matching the picture.\n";
    legend += "LA - A word in target language and a matching picture.\n";
    legend += "TS - Translate the sentence.\n\n";
    legend += "Vmistake - vocabulary mistake.\nNmistake - number mistake.\nPmistake - pronoun mistake.\nSmistake - spelling mistake.\nLmistake - language mistake.\n\n";

    document.getElementById('legend').innerHTML = "<pre>" + legend + "</pre>";


    //listen to the checkboxes
    document.getElementById('dd').onchange = function(){

        var text = "";      //PAT output var
        var array = [];     //array for checkboxes

        if (document.getElementById('language').checked) array.push('L');           // add checked items to the array
        else if (array.indexOf('L') != -1) array.splice(array.indexOf('L'), 1);     // delete from the array when unchecked

        if (document.getElementById('number').checked) array.push('N');
        else if (array.indexOf('N') != -1) array.splice(array.indexOf('N'), 1);

        if (document.getElementById('pronoun').checked == true) array.push('P');
        else if (array.indexOf('P') != -1) array.splice(array.indexOf('P'), 1);

        if (document.getElementById('spelling').checked) array.push('S');
        else if (array.indexOf('S') != -1) array.splice(array.indexOf('S'), 1);

        if (document.getElementById('vocabulary').checked) array.push('V');
        else if (array.indexOf('V') != -1) array.splice(array.indexOf('V'), 1);

        var len = array.length;
     

        // **************
        // GENERATING PAT CODE
        // **************
        db.ref('/Users').once('value', function(snapshot){

            // for each user in /Users
            snapshot.forEach(function (fSnapshot){
                
                
                //loop only if the node has a child "3". Oth it's not a user ex history but a user profile
                if (fSnapshot.hasChild("3")){
                    text += "UserData() = ";
                    var ref = fSnapshot.child("3");

                    //for each exercise in /Users/3
                    ref.forEach(function (sSnapshot){

                        //for each try in /Users/3/ex
                        sSnapshot.forEach(function (tSnapshot){
                            if (tSnapshot.hasChildren()){
                                
                                text += "\r\nexercise -> ";
                                //text += exType + " -> ";
                                var exType = tSnapshot.val().exType;
                                if (tSnapshot.val().corr !== 0){                   //corr 0 means no mistake
                                    var mistType = tSnapshot.val().exSubj;         //get the mistake type of the given try from the DB
                                }
                            
                                // check mistake type against every checked type from the array
                                if (len != 0){
                                    for (i = 0; i < len; i++){
                                        if (mistType == array[i]) {
                                            text += mistType + "mistake ->";
                                            break;
                                        }
                                        if (i == len - 1) text += "correct ->";
                                    }
                                } else text += "correct ->";
                                
                                
        
                            }
        
                        });
                    });

                    text += " Stop();\r\n";

                }
                
            });
            // ********
            // DONE GENERATING PAT CODE
            // ********
    
            // upload the pat to the webpage
            document.getElementById('textContainer').innerHTML = "<pre style='padding:20px;'>" + text + "</pre>";
    
            //listen to the download button
            document.getElementById('download-button').addEventListener('click', function(){ 
                var filename = "pat.txt";
                
                download(filename, text);
            }, false);

        });     
    }
}
