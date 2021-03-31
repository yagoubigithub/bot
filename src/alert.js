const Alert = require("electron-alert");
function showAlert(message){
    

  
    

let alert = new Alert();

let swalOptions = {
	title: "alert?",
	text: message,
	type: "warning",
	showCancelButton: true
};

let promise = alert.fireWithFrame(swalOptions, message, null, false);
console.log(message)
promise.then((result) => {
	if (result.value) {
		// confirmed
	} else if (result.dismiss === Alert.DismissReason.cancel ){
		// canceled
	}
})
    
}

module.exports.showAlert = showAlert;