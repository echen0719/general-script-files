(async () => {
    const url = 'https://www.deltamath.com/api/module_data_settings';
    
    const payload = {
        "correct": 1,
        "sk": "calculusFlashCards",
        "jwt": "", // key found by network requests
        "operation": "update_record",
        "history": {
        },
        "teacher_id": 0, // both also found in network requests
        "teachercode": 0,
    };

    let currentScore = Number(prompt("Current Score: "));
    let targetScore = Number(prompt("Desired Score: "));
    let step = Number(prompt("How much to increment each time?: "));

    console.log("Script start");

    for (let i = currentScore + step; i <= targetScore; i += step) {
        payload["score"] = i;
        payload["record"] = i;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { // idk why this is needed
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) // object to JSON
            });

            if (response.ok) {
                console.log(`Successfully updated score to: ${i}`);
            } 
            else {
                console.log("Something wrong with DeltaMath");
                break;
            }
        } 
        catch (error) {
            console.error("Something wrong with DeltaMath");
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log("Finished!");
})();
