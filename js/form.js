function sendEmail(){
    Email.send({
        SecureToken:"8f96d0d3-c7df-4344-8e28-17e446413306",
        To : 'laiho62@gmail.com',
        From : document.getElementById("email").value,
        Subject : "New Contact From Cv",
        Body : "Name: " + document.getElementById("name").value + 
        "<br> Email: " + document.getElementById("email").value +
        "<br> Message " + document.getElementById("message").value
    }).then(
      message => alert("Message sent Succesfully")
    );
}