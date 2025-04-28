let publicKey = "BC80LO1QR4OGnbbOOO9AqoklsCig2U09cl5-OKydkd3OSdQ_d3vDg6Ht1h0j50U8ylEAggS1CavesgfbASnrqHw";

if("serviceWorker" in navigator){
    send().catch(error => console.error(error));
}

async function send(){
    //Registering sevice workers
    const register = await navigator.serviceWorker.register('./sw.js', {
        scope:'/'
    });
    // Subscription to push notification
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(publicKey)
    });

    console.log("Subscribe to the push notifications...");

    await fetch(`http://localhost:3000/api/v1/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });

      console.log('Subscription send...');
}


// Converting public key url
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}