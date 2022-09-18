const openBtn = document.querySelector("#open");
const closeBtn = document.querySelector("#close");
const info = document.querySelector("#info");
const draggable = document.querySelector("#draggable");

const BAUD_RATE = 9600;
let port;

const remap = (n, in_min, in_max, out_min, out_max) => {
    return parseInt((n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

openBtn.onclick = async () => {
    try {
        port = await navigator.serial.requestPort(); // access port
        await port.open({ baudRate: BAUD_RATE }); // open port
        console.log("port opened successfully");

        info.innerText = `Port info: ${JSON.stringify(port.getInfo())}`;

        while (port.readable) {
            const reader = port.readable.getReader();

            let data = "";
            
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log("done");
                        break;
                    }
                    const buffer = String.fromCharCode.apply(null, value); // convert uint8array to string
                    if (buffer === "\n") { // check if end of line
                        data = JSON.parse(data);
                        if (data.button) {
                            draggable.style.left = `${remap(data.x, 0, 4095, 0, window.innerWidth - 50)}px`;
                            draggable.style.top = `${remap(data.y, 0, 4095, 0, window.innerHeight - 50)}px`;
                        }
                        data = ""; // reset data for new line
                    } else {
                        data += buffer; // add received buffer to data
                    }
                } 
            } catch (err) {
                console.log(err);
            } finally {
                reader.releaseLock();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

closeBtn.onclick = () => {
    port.close(); // close port
    port.forget();
    info.innerText = "";
    console.log("port closed");
}