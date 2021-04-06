
const { dialog } = require('electron')

function showMessage( message){
    const options = {
       
        title: "message",
        message: message,
        detail: message,
       
      };
    
      dialog.showMessageBox(null, options, (response, checkboxChecked) => {
        
      });
}

module.exports = showMessage
