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

window.onload = function(){
    // [NAV_LINKS]

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var email = user.email.split('.').join("");
            var ref = db.ref('/Users/' + email + "/Data");
        
            ref.once("value", function(snap){
                console.log(snap.child('accountType').val());
                //only researchers can see PAT data and upload classes
                if (snap.child('accountType').val() === "researcher"){
                    document.getElementById('pat').classList.remove('disabled');
                    document.getElementById('class').classList.remove('disabled');
                }
            });
            // [END_NAV_LINKS]
        }
    });
   
};

function loadIndivData(uid){
    // ***********************
    // func for MISTAKES INDIV
    // ***********************
    var ref = db.ref('analytics/userData/' + uid);       //DB ref to the user

    ref.on("value", function(snapshot){
        
    });

    ref.on("value", function (snapshot) {

        //getting data from DB
        var mistP = snapshot.val().mistP;
        var mistN = snapshot.val().mistN;
        var mistL = snapshot.val().mistL;
        var mistS = snapshot.val().mistS;
        var mistV = snapshot.val().mistV;

        //rendering the chart
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Individual data for user mistakes"
            },
            axisY: {
                title: "Mistakes quantity",
                titleFontSize: 18
            },
            data: [{
                type: "column",
                yValueFormatString: "#,### Units",

                //adding data to the chart
                dataPoints: [      
                    { y: mistP, label: "Pronoun mistake" },
                    { y: mistN,  label: "Number mistake" },
                    { y: mistL,  label: "Language mistake" },
                    { y: mistS,  label: "Spelling mistake" },
                    { y: mistV,  label: "Vocabulary mistake" }
                ]
            }]
        });
        chart.render();


        // ***********************
        // func for SFRATE INDIV
        // ***********************
        var succ = snapshot.val().SFRate * 100;
        var fail = 100 - succ;

        var SFRateChart = new CanvasJS.Chart("SFRateIndiv", {
            animationEnabled: true,
            title: {
                text: "Individual data for success vs failure rate"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: [
                    {y: succ, label: "Success"},
                    {y: fail, label: "Failure"}
                ]
            }]
        });
        SFRateChart.render();
    });

}

function loadExData(){
    // ********************
    //func for SFRATE BY EX TYPE
    // ********************
    ref = db.ref('analytics/exData');       //DB ref to the user
    ref.on("value", function (snapshot) {

        //getting data from DB
        var BS = snapshot.val().BS.SFRate;
        var TS = snapshot.val().TS.SFRate;
        var MA = snapshot.val().MA.SFRate;
        var LA = snapshot.val().LA.SFRate;

        //rendering the chart
        var SFExchart = new CanvasJS.Chart("CCSFRateExType", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Success vs Failure rate by exercise types"
            },
            axisY: {
                title: "SFRate",
                titleFontSize: 18
            },
            data: [{
                type: "column",
                yValueFormatString: "#,### Units",

                //adding data to the chart
                dataPoints: [      
                    { y: BS,  label: "BS" },
                    { y: LA,  label: "LA" },
                    { y: MA,  label: "MA" },
                    { y: TS,  label: "TS" }
                ]
            }]
        });
        SFExchart.render();
        
    });
}

function loadPopData() {

    // ********************
    //func for MISTAKES ALL
    // ********************
    var ref = db.ref('analytics/popData');       //DB ref to the user

    ref.on("value", function (snapshot) {

        //getting data from DB
        var mistP = snapshot.val().mistP;
        var mistN = snapshot.val().mistN;
        var mistL = snapshot.val().mistL;
        var mistS = snapshot.val().mistS;
        var mistV = snapshot.val().mistV;

        //rendering the chart
        var chart = new CanvasJS.Chart("CCMistAll", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Population data for user mistakes"
            },
            axisY: {
                title: "Mistakes quantity",
                titleFontSize: 18
            },
            data: [{
                type: "column",
                yValueFormatString: "#,### Units",

                //adding data to the chart
                dataPoints: [      
                    { y: mistP, label: "Pronoun mistake" },
                    { y: mistN,  label: "Number mistake" },
                    { y: mistL,  label: "Language mistake" },
                    { y: mistS,  label: "Spelling mistake" },
                    { y: mistV,  label: "Vocabulary mistake" }
                ]
            }]
        });
        chart.render();

        var succ = snapshot.val().SFRate * 100;
        var fail = 100 - succ;

        var SFRateChart = new CanvasJS.Chart("CCSFRateAll", {
            animationEnabled: true,
            title: {
                text: "Population data for success vs failure rate"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: [
                    {y: succ, label: "Success"},
                    {y: fail, label: "Failure"}
                ]
            }]
        });
        SFRateChart.render();

    });

}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function checkUser(dataType){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            console.log(user);

            var uid = user.uid;
            var email = user.email;
            
            var status;
            var splitEmail = email.split('.').join("");
            console.log(splitEmail);
            
            db.ref('Users/' + splitEmail + "/Data/").once('value', function(snapshot){

                if(snapshot.child("accountType").val() === "researcher"){
                    status = "researcher";

                    if (dataType == 'pop'){
                        var text = '<!-- CHART CONTAINER 2 | MISTAKES ALL -->';
                        text += '<div id="CCMistAll" class="mx-auto" style="height: 300px; width: 40%;"></div>';
                        text += '<!-- CHART CONTAINER 3 | SFRATE ALL -->';
                        text += '<div id="CCSFRateAll" class="mx-auto" style="height: 300px; width: 40%;"></div>';

                        document.getElementById("charts").innerHTML = text;
                        loadPopData();
                    } else if (dataType == 'indiv'){
                        var text = '<!-- CHART CONTAINER 1 | MISTAKES INDIV -->';
                        text += '<div id="chartContainer" class="mx-auto" style="height: 300px; width: 40%;"></div>';
                        text += '<!-- CHART | SFRATE INDIV -->';
                        text += '<div id="SFRateIndiv" class="mx-auto" style="height: 300px; width: 40%;"></div>';

                        document.getElementById("charts").innerHTML = text;
                        loadIndivData(uid);
                    } else if (dataType == 'ex'){
                        var text = '<!-- CHART CONTAINER 4 | SFRATE EXTYPE -->';
                        text += '<div id="CCSFRateExType" class="mx-auto" style="height: 300px; width: 40%;"></div>';

                        document.getElementById("charts").innerHTML = text;
                        loadExData();
                    }
                    
                } else {
                    status = "student";

                    if (dataType == 'pop'){
                        alert("You are authorized as a student and have no access to population data. To change your status, please, go to the authorization page.");
                    } else if (dataType == 'indiv'){
                        var text = '<!-- CHART CONTAINER 1 | MISTAKES INDIV -->';
                        text += '<div id="chartContainer" class="mx-auto" style="height: 300px; width: 40%;"></div>';

                        document.getElementById("charts").innerHTML = text;
                        loadIndivData(uid);
                    } else if (dataType == 'ex'){
                        alert("You are authorized as a student and have no access to exercise data. To change your status, please, go to the authorization page.");
                    }
                }
            });
    

            

        } else {
          alert("Please authorize.");
        }
    });
}