function runRedirect(direction) {
    if(direction == "/cikis"){
        
        setTimeout(() => {
            window.location.href = '/';
        }, 2500);
    }
}

runRedirect(window.location.pathname);
// NodeJS'te bunu yapmaya çalıştım ancak yapamadım. 
// Geçici çözüm olarak buradan deneyeceğim :)