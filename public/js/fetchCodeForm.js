(function() {
    var form = document.querySelector('form');
    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        if (form.id == 'addCode') {
            console.log("submitted code");
            var result = fetch('/code/add', {
                method: 'post',
                body: new FormData(form)
            });
            result.then(function(response) {
                if (response.status === 200) {
                    alert("submitted successfully");
                    location.reload(); 
                }
                console.log(response);
            });
        } else if (form.id == 'addUsername') {
            console.log("submitted username.");
            var result = fetch('/user/addUserName', {
                method: 'post',
                body: new FormData(form)
            });
            result.then(function(response) {
                if (response.status === 200) {
                    alert("Username Successfully set!");
                    location.reload(); 
                }
                console.log(response);
            });
        }
    });
})();
