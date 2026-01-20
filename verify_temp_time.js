const runTest = (isoString, expected) => {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Bogota",
        hour: "numeric",
        hour12: false,
    });
    const hour = parseInt(formatter.format(date), 10);
    const isOpen = hour >= 7 && hour < 20;

    console.log(`Time (UTC): ${isoString} -> Hour (Bogota): ${hour}, Is Open: ${isOpen}, Expected: ${expected} -> ${isOpen === expected ? 'PASS' : 'FAIL'}`);
};

console.log("--- Testing Time Logic ---");
runTest("2023-12-25T11:59:59Z", false);  // 6:59 AM Bogota
runTest("2023-12-25T12:00:00Z", true);   // 7:00 AM Bogota
runTest("2023-12-25T17:00:00Z", true);   // 12:00 PM Bogota
runTest("2023-12-26T00:59:59Z", true);   // 7:59 PM Bogota
runTest("2023-12-26T01:00:00Z", false);  // 8:00 PM Bogota
